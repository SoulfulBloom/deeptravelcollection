import { generateStandalonePDF } from '../utils/standaloneItineraryGenerator';
import { db } from '../db';
import { userPurchases, destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';
import { itineraryGenerator } from './itineraryGenerator';

// PDF generation job interface
interface PDFGenerationJob {
  purchaseId: number;
  destinationId: number;
  templateId: number;
  email: string;
  sessionId: string;
}

// In-memory job queue (since we don't have Redis configured)
class InMemoryJobQueue {
  private jobs: Map<string, any> = new Map();
  private jobCounter: number = 0;
  private runningJobs: Map<string, boolean> = new Map();
  private jobProgress: Map<string, number> = new Map();
  private jobStatus: Map<string, 'waiting' | 'active' | 'completed' | 'failed'> = new Map();
  
  async add(data: any, options?: any): Promise<{ id: string }> {
    const jobId = `job_${Date.now()}_${this.jobCounter++}`;
    this.jobs.set(jobId, data);
    this.jobStatus.set(jobId, 'waiting');
    this.jobProgress.set(jobId, 0);
    
    // Automatically process the job (no need for a separate processor)
    setTimeout(() => this.processJob(jobId), 100);
    
    return { id: jobId };
  }
  
  async getJob(jobId: string | number): Promise<any | null> {
    if (!this.jobs.has(jobId.toString())) {
      return null;
    }
    
    return {
      id: jobId,
      data: this.jobs.get(jobId.toString()),
      progress: async (percent?: number) => {
        if (percent !== undefined) {
          this.jobProgress.set(jobId.toString(), percent);
        }
        return this.jobProgress.get(jobId.toString()) || 0;
      },
      getState: async () => {
        return this.jobStatus.get(jobId.toString()) || 'waiting';
      },
      remove: async () => {
        this.jobs.delete(jobId.toString());
        this.runningJobs.delete(jobId.toString());
        this.jobProgress.delete(jobId.toString());
        this.jobStatus.delete(jobId.toString());
        return true;
      },
      finishedOn: null
    };
  }
  
  private async processJob(jobId: string) {
    try {
      this.runningJobs.set(jobId, true);
      this.jobStatus.set(jobId, 'active');
      
      const jobData = this.jobs.get(jobId);
      
      // Process the job using our existing processor logic
      await this.jobProcessor({ 
        data: jobData,
        progress: async (percent: number) => {
          this.jobProgress.set(jobId, percent);
          return percent;
        }
      });
      
      this.jobStatus.set(jobId, 'completed');
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      this.jobStatus.set(jobId, 'failed');
    } finally {
      this.runningJobs.set(jobId, false);
    }
  }
  
  async jobProcessor(job: any) {
    const { purchaseId, destinationId, templateId, email, sessionId } = job.data as PDFGenerationJob;
    
    try {
      console.log(`Starting PDF generation for purchase ${purchaseId}`);
      
      // Create output directory if it doesn't exist
      const outputDir = path.resolve('./tmp/itineraries');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Generate PDF
      const outputPath = path.join(outputDir, `itinerary_${purchaseId}.pdf`);
      
      // Update status in database to show generating
      await db
        .update(userPurchases)
        .set({
          status: 'generating',
        })
        .where(eq(userPurchases.id, purchaseId));
        
      // Report progress at 30%
      await job.progress(30);
      
      // Generate AI content using OpenAI
      console.log(`Generating AI content with OpenAI for purchase ${purchaseId}`);
      
      try {
        // Get the destination
        const destination = await db.query.destinations.findFirst({
          where: eq(destinations.id, destinationId)
        });
        
        if (!destination) {
          throw new Error(`Destination with ID ${destinationId} not found`);
        }
        
        // Use the premium generator type from config
        const { itineraryGeneratorFactory } = await import('../services/itineraryGeneratorFactory');
        const { premiumGeneratorType } = await import('../config');
        
        console.log(`Using ${premiumGeneratorType} generator to create premium itinerary for ${destination.name}`);
        const premiumContent = await itineraryGeneratorFactory.generateItinerary(
          destination, 
          premiumGeneratorType // Use the premium generator type from config
        );
        
        // Cache the generated premium content so we can use it in the PDF
        if (!global._cachedPremiumContent) {
          global._cachedPremiumContent = {};
        }
        global._cachedPremiumContent[destinationId] = premiumContent;
        
        // Report progress at 60% - AI content generated
        await job.progress(60);
      } catch (aiError) {
        console.error(`Error generating AI content: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`);
        // Continue with PDF generation even if AI content fails
      }
      
      // Get the destination to use with standalone generator
      const destination = await db.query.destinations.findFirst({
        where: eq(destinations.id, destinationId)
      });
      
      if (!destination) {
        throw new Error(`Destination with ID ${destinationId} not found`);
      }
      
      // Generate the PDF using the standalone generator
      console.log(`Generating PDF for ${destination.name} using standalone generator...`);
      const pdfBuffer = await generateStandalonePDF(destination);
      
      // Save the buffer to a file
      fs.writeFileSync(outputPath, pdfBuffer);
      const pdfPath = outputPath;
      
      // Report progress at 90% - PDF generated, finalizing
      await job.progress(90);
      
      // Get public path for the PDF
      const publicPath = `/downloads/itineraries/${path.basename(pdfPath)}`;
      
      // Update purchase record
      await db
        .update(userPurchases)
        .set({
          status: 'completed',
          completedAt: new Date(),
          pdfUrl: publicPath,
        })
        .where(eq(userPurchases.id, purchaseId));
        
      // Mark job as 100% complete  
      await job.progress(100);
      
      console.log(`PDF generation completed for purchase ${purchaseId}`);
      
      return { success: true, pdfUrl: publicPath };
    } catch (error) {
      console.error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Update status to failed
      await db
        .update(userPurchases)
        .set({
          status: 'failed',
        })
        .where(eq(userPurchases.id, purchaseId));
      
      throw error;
    }
  }
}

// Create a singleton instance of our in-memory queue
const pdfQueue = new InMemoryJobQueue();

/**
 * Add a PDF generation job to the queue
 */
export async function queuePDFGeneration({
  purchaseId,
  destinationId,
  templateId,
  email,
  sessionId,
}: PDFGenerationJob): Promise<{ jobId: string | number }> {
  try {
    // Add job to queue
    const job = await pdfQueue.add({
      purchaseId,
      destinationId,
      templateId,
      email,
      sessionId,
    }, {
      attempts: 3, // Try up to 3 times
      backoff: {
        type: 'exponential',
        delay: 5000, // Start with 5 second delay
      }
    });
    
    // Store job ID in the purchase record for status tracking
    await db
      .update(userPurchases)
      .set({
        jobId: job.id.toString(),
      })
      .where(eq(userPurchases.id, purchaseId));
    
    return { jobId: job.id };
  } catch (error) {
    console.error(`Error queueing PDF generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Get the status of a PDF generation job
 */
export async function getPDFJobStatus(jobId: string | number): Promise<{ 
  completed: boolean;
  failed: boolean;
  progress: number;
  job?: any;
}> {
  try {
    // Get job from queue
    const job = await pdfQueue.getJob(jobId);
    
    if (!job) {
      return {
        completed: false,
        failed: true,
        progress: 0,
      };
    }
    
    // Get job status
    const state = await job.getState();
    const progress = await job.progress();
    
    return {
      completed: state === 'completed',
      failed: state === 'failed',
      progress: typeof progress === 'number' ? progress : 0,
      job: {
        id: job.id,
        state,
        progress,
        data: job.data,
        finishedOn: job.finishedOn,
      }
    };
  } catch (error) {
    console.error(`Error getting job status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      completed: false,
      failed: true,
      progress: 0,
    };
  }
}

/**
 * Cancel a PDF generation job
 */
export async function cancelPDFJob(jobId: string | number): Promise<boolean> {
  try {
    // Get job from queue
    const job = await pdfQueue.getJob(jobId);
    
    if (!job) {
      return false;
    }
    
    // Remove job from queue
    await job.remove();
    
    return true;
  } catch (error) {
    console.error(`Error canceling job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
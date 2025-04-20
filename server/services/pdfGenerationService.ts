/**
 * PDF Generation Service
 * 
 * Handles the generation of premium PDFs including itineraries,
 * digital nomad packages, and other premium content.
 */

import fs from 'fs';
import path from 'path';
import { generateStandalonePDF } from '../utils/standaloneItineraryGenerator';
import { db } from '../db';
import { userPurchases, destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { sendPdfGenerationCompleteEmail } from './emailService';
import { randomUUID } from 'crypto';

// Define different content types
export type ContentType = 'premium_itinerary' | 'digital_nomad_package' | 'snowbird_toolkit' | 'pet_travel_guide';

// PDF generation job interface
interface PdfGenerationJob {
  purchaseId: number;
  destinationId?: number;
  email: string;
  contentType: ContentType;
}

// PDF generation queue singleton
class PdfGenerationQueue {
  private static instance: PdfGenerationQueue;
  private queue: PdfGenerationJob[] = [];
  private isProcessing: boolean = false;
  private completedJobs: Map<number, string> = new Map(); // Maps purchaseId to PDF URL
  
  private constructor() {}
  
  public static getInstance(): PdfGenerationQueue {
    if (!PdfGenerationQueue.instance) {
      PdfGenerationQueue.instance = new PdfGenerationQueue();
    }
    return PdfGenerationQueue.instance;
  }
  
  /**
   * Add a job to the PDF generation queue
   * 
   * @param job PDF generation job details
   * @returns Reference ID for the job
   */
  public addJob(job: PdfGenerationJob): number {
    console.log(`Adding PDF generation job for purchase ${job.purchaseId}`);
    this.queue.push(job);
    
    // Start processing if not already processing
    if (!this.isProcessing) {
      this.processNextJob();
    }
    
    return job.purchaseId;
  }
  
  /**
   * Check if a PDF is ready for download
   * 
   * @param purchaseId Purchase ID to check
   * @returns PDF URL if ready, null otherwise
   */
  public getPdfUrl(purchaseId: number): string | null {
    return this.completedJobs.get(purchaseId) || null;
  }
  
  /**
   * Process the next job in the queue
   */
  private async processNextJob(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    const job = this.queue.shift();
    
    if (!job) {
      this.isProcessing = false;
      return;
    }
    
    try {
      console.log(`Processing PDF generation job for purchase ${job.purchaseId}`);
      
      // Update status in database
      await db
        .update(userPurchases)
        .set({
          status: 'generating',
        })
        .where(eq(userPurchases.id, job.purchaseId));
      
      // Create output directory if it doesn't exist
      const outputDir = path.resolve('./tmp/premium-content');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      let pdfBuffer: Buffer;
      let outputFilename: string;
      
      // Handle different content types
      if (job.contentType === 'premium_itinerary' && job.destinationId) {
        // Get the destination
        const destination = await db.query.destinations.findFirst({
          where: eq(destinations.id, job.destinationId)
        });
        
        if (!destination) {
          throw new Error(`Destination not found for ID ${job.destinationId}`);
        }
        
        // Generate custom itinerary PDF
        pdfBuffer = await generateStandalonePDF(destination);
        outputFilename = `itinerary_${destination.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${randomUUID().substring(0, 8)}.pdf`;
      } else if (job.contentType === 'digital_nomad_package') {
        // Copy the standard digital nomad package PDF
        const sourcePath = path.resolve('./public/premium-content/digital_nomad_package.pdf');
        pdfBuffer = fs.readFileSync(sourcePath);
        outputFilename = `digital_nomad_package_${randomUUID().substring(0, 8)}.pdf`;
      } else if (job.contentType === 'snowbird_toolkit') {
        // Copy the standard snowbird toolkit PDF
        const sourcePath = path.resolve('./public/premium-content/snowbird_toolkit.pdf');
        pdfBuffer = fs.readFileSync(sourcePath);
        outputFilename = `snowbird_toolkit_${randomUUID().substring(0, 8)}.pdf`;
      } else if (job.contentType === 'pet_travel_guide') {
        // Copy the standard pet travel guide PDF
        const sourcePath = path.resolve('./public/premium-content/pet_travel_guide.pdf');
        pdfBuffer = fs.readFileSync(sourcePath);
        outputFilename = `pet_travel_guide_${randomUUID().substring(0, 8)}.pdf`;
      } else {
        throw new Error(`Unsupported content type: ${job.contentType}`);
      }
      
      // Save PDF to file
      const outputPath = path.join(outputDir, outputFilename);
      fs.writeFileSync(outputPath, pdfBuffer);
      
      // Calculate public URL for the PDF
      const pdfUrl = `/api/download-pdf/${outputFilename}`;
      
      // Update purchase record with PDF URL
      await db
        .update(userPurchases)
        .set({
          status: 'completed',
          pdfUrl,
          completedAt: new Date()
        })
        .where(eq(userPurchases.id, job.purchaseId));
      
      // Store PDF URL in completed jobs map
      this.completedJobs.set(job.purchaseId, pdfUrl);
      
      // Send email notification
      const purchase = await db.query.userPurchases.findFirst({
        where: eq(userPurchases.id, job.purchaseId)
      });
      
      if (purchase) {
        await sendPdfGenerationCompleteEmail(purchase, `${process.env.HOST_URL || 'http://localhost:3000'}${pdfUrl}`);
      }
      
      console.log(`PDF generation completed for purchase ${job.purchaseId}`);
    } catch (error) {
      console.error(`Error generating PDF for purchase ${job.purchaseId}:`, error);
      
      // Update status in database
      await db
        .update(userPurchases)
        .set({
          status: 'failed'
        })
        .where(eq(userPurchases.id, job.purchaseId));
    } finally {
      // Process next job
      setTimeout(() => this.processNextJob(), 100);
    }
  }
}

// Export singleton instance
export const pdfGenerationQueue = PdfGenerationQueue.getInstance();

/**
 * Queue a PDF generation job
 * 
 * @param job PDF generation job details
 * @returns Reference ID for the job
 */
export function queuePdfGeneration(job: PdfGenerationJob): number {
  return pdfGenerationQueue.addJob(job);
}

/**
 * Check if a PDF is ready for download
 * 
 * @param purchaseId Purchase ID to check
 * @returns PDF URL if ready, null otherwise
 */
export function getPdfUrl(purchaseId: number): string | null {
  return pdfGenerationQueue.getPdfUrl(purchaseId);
}
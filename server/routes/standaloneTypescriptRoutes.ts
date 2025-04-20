import { Router } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { generateItinerary } from '../utils/standaloneGeneratorTs';
import { db } from '../db';
import { destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Generate a PDF itinerary using the TypeScript standalone generator
router.get('/typescript-generator/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Get the destination
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    console.log(`Starting TypeScript generation for ${destination.name}...`);
    
    // Create output directory if needed
    const outputDir = path.join(process.cwd(), 'tmp', 'typescript-itineraries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate the PDF using the TypeScript generator
    const pdfBuffer = await generateItinerary(destination);
    
    // Save to file for caching
    const filename = `${destination.name.toLowerCase().replace(/\s+/g, '-')}-typescript-itinerary.pdf`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    
    // Increment the download count
    await db.update(destinations)
      .set({ downloadCount: (destination.downloadCount || 0) + 1 })
      .where(eq(destinations.id, id));
    
    // Send the PDF directly as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error in TypeScript generator:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

export default router;
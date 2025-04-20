import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { db } from '../db';
import { snowbirdDestinations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { generateSnowbirdPDF } from '../utils/snowbirdItineraryGenerator';

const router = Router();

// Get all snowbird destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await db.select().from(snowbirdDestinations);
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching snowbird destinations:', error);
    res.status(500).json({ error: 'Failed to fetch snowbird destinations' });
  }
});

// Get a specific snowbird destination
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [destination] = await db.select().from(snowbirdDestinations).where(eq(snowbirdDestinations.id, id));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching snowbird destination:', error);
    res.status(500).json({ error: 'Failed to fetch snowbird destination' });
  }
});

// Generate an itinerary and get the download URL for a snowbird destination
router.get('/:id/itinerary', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if the destination exists
    const [destination] = await db.select().from(snowbirdDestinations).where(eq(snowbirdDestinations.id, id));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'downloads', 'snowbird-itineraries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Determine filename
    const filename = `${destination.name.toLowerCase().replace(/\s+/g, '-')}-snowbird-itinerary.pdf`;
    const filePath = path.join(outputDir, filename);
    
    // Check if we already have this itinerary cached
    if (fs.existsSync(filePath)) {
      const downloadUrl = `/downloads/snowbird-itineraries/${filename}`;
      return res.json({
        status: 'success',
        message: 'Itinerary found',
        downloadUrl
      });
    }
    
    // Generate the itinerary
    console.log(`Generating itinerary for ${destination.name}...`);
    const pdfBuffer = await generateSnowbirdPDF(destination);
    
    // Save the buffer to the file
    fs.writeFileSync(filePath, pdfBuffer);
    
    // Return the download URL
    const downloadUrl = `/downloads/snowbird-itineraries/${filename}`;
    res.json({
      status: 'success',
      message: 'Itinerary generated successfully',
      downloadUrl
    });
  } catch (error) {
    console.error('Error generating snowbird itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// Download the itinerary
router.get('/:id/download', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if the destination exists
    const [destination] = await db.select().from(snowbirdDestinations).where(eq(snowbirdDestinations.id, id));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    console.log(`Processing download request for ${destination.name} itinerary...`);
    
    // Create output directory if needed
    const outputDir = path.join(process.cwd(), 'public', 'downloads', 'snowbird-itineraries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Determine filename
    const filename = `${destination.name.toLowerCase().replace(/\s+/g, '-')}-snowbird-itinerary.pdf`;
    const filePath = path.join(outputDir, filename);
    
    // Generate PDF if it doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log(`Generating new itinerary PDF for ${destination.name}...`);
      const pdfBuffer = await generateSnowbirdPDF(destination);
      fs.writeFileSync(filePath, pdfBuffer);
    } else {
      console.log(`Using existing itinerary PDF for ${destination.name}`);
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading snowbird itinerary:', error);
    res.status(500).json({ error: 'Failed to download itinerary' });
  }
});

export default router;
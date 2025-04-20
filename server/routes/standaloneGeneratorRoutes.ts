/**
 * Standalone Generator Routes
 * 
 * These routes provide access to the simplified, standalone PDF generator
 * that bypasses the complex PDF rendering system. This approach uses a single
 * OpenAI API call with a comprehensive prompt to generate high-quality 
 * itineraries directly.
 */

import express from 'express';
import { generateStandalonePDF } from '../utils/standaloneItineraryGenerator';
import { storage } from '../storage';

const router = express.Router();

// Test endpoint - Access this directly in your browser to generate a test PDF
// Example: http://localhost:5000/api/standalone/test
router.get('/standalone/test', async (req, res) => {
  try {
    console.log("Testing standalone itinerary generator...");
    
    // Get a destination to use for the test
    const destinations = await storage.getDestinations();
    
    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ message: "No destinations available for testing" });
    }
    
    // Use the first destination
    const destination = destinations[0];
    console.log(`Using destination: ${destination.name}, ${destination.country} for standalone generator test`);
    
    // Generate the PDF
    const pdfBuffer = await generateStandalonePDF(destination);
    
    // Send the PDF
    res.setHeader("Content-Disposition", `attachment; filename=${destination.name}_Standalone_Itinerary.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error testing standalone generator:", error);
    res.status(500).json({ 
      message: "Failed to generate PDF with standalone generator", 
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Generate PDF for a specific destination
// Example: http://localhost:5000/api/standalone/destination/35
router.get('/standalone/destination/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const destination = await storage.getDestinationById(id);
    
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    console.log(`Generating standalone PDF for ${destination.name}, ${destination.country}`);
    
    // Generate the PDF
    const pdfBuffer = await generateStandalonePDF(destination);
    
    // Increment download count
    await storage.incrementDownloadCount(id);
    
    // Send the PDF
    res.setHeader("Content-Disposition", `attachment; filename=${destination.name}_Premium_Itinerary.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating standalone PDF:", error);
    res.status(500).json({ 
      message: "Failed to generate standalone PDF", 
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
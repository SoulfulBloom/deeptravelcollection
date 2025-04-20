import express from 'express';
import { storage } from '../storage';

const router = express.Router();

// Get seasonal information for a specific destination
router.get('/api/destinations/:id/seasonal', async (req, res) => {
  try {
    const destinationId = parseInt(req.params.id);
    if (isNaN(destinationId)) {
      return res.status(400).json({ message: 'Invalid destination ID' });
    }

    console.log(`Getting seasonal info for destination ID: ${destinationId}`);
    const seasonalInfo = await storage.getDestinationSeasonalInfo(destinationId);
    
    if (!seasonalInfo) {
      console.log(`No seasonal info found for destination ID: ${destinationId}`);
      return res.status(404).json({ message: 'Seasonal information not found for this destination' });
    }

    console.log(`Retrieved seasonal info for ${seasonalInfo.name}`);
    res.json(seasonalInfo);
  } catch (error) {
    console.error('Error fetching seasonal destination data:', error);
    res.status(500).json({ message: 'Failed to fetch seasonal destination data', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get peak tourist months for a specific destination
router.get('/api/destinations/:id/peak-tourist-months', async (req, res) => {
  try {
    const destinationId = parseInt(req.params.id);
    if (isNaN(destinationId)) {
      return res.status(400).json({ message: 'Invalid destination ID' });
    }

    console.log(`Getting peak tourist months for destination ID: ${destinationId}`);
    const peakMonths = await storage.getDestinationsPeakTouristMonths(destinationId);
    console.log(`Peak months found: ${JSON.stringify(peakMonths)}`);
    
    // Map month numbers to month names for better readability
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const peakMonthsWithNames = peakMonths.map(monthNum => ({
      monthNumber: monthNum,
      monthName: monthNames[monthNum - 1]
    }));

    res.json({
      destinationId,
      peakTouristMonths: peakMonthsWithNames
    });
  } catch (error) {
    console.error('Error fetching peak tourist months:', error);
    res.status(500).json({ message: 'Failed to fetch peak tourist months', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
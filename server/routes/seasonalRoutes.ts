// server/routes/seasonalRoutes.ts
import { Router } from 'express';
import { db } from '../db';
import { destinations, seasonalDestinations } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get seasonal information for a specific destination
router.get('/seasonal/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    // Find basic destination info
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(destinationId, 10)));
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Find seasonal information
    const [seasonalInfo] = await db
      .select()
      .from(seasonalDestinations)
      .where(eq(seasonalDestinations.destinationId, parseInt(destinationId, 10)));
    
    if (!seasonalInfo) {
      return res.status(404).json({ message: 'Seasonal information not found for this destination' });
    }
    
    // Parse JSON fields
    const shoulderPeriods = JSON.parse(seasonalInfo.shoulderPeriods);
    const majorEvents = JSON.parse(seasonalInfo.majorEvents);
    
    // Format response in the desired structure
    const response = {
      id: destination.id.toString(),
      name: destination.name,
      country: destination.country,
      seasons: {
        summer: { 
          startMonth: seasonalInfo.summerStart, 
          endMonth: seasonalInfo.summerEnd 
        },
        winter: { 
          startMonth: seasonalInfo.winterStart, 
          endMonth: seasonalInfo.winterEnd 
        },
        shoulder: { 
          periods: shoulderPeriods 
        }
      },
      peakTouristMonths: seasonalInfo.peakTouristMonths,
      weatherAlerts: seasonalInfo.weatherAlerts || [],
      majorEvents: majorEvents,
      lastUpdated: seasonalInfo.lastUpdated,
      nextUpdateDue: seasonalInfo.nextUpdateDue
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching seasonal information:', error);
    res.status(500).json({ message: 'Failed to fetch seasonal information' });
  }
});

// Get peak tourist months for a specific destination
router.get('/peak-months/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    const [seasonalInfo] = await db
      .select({
        peakMonths: seasonalDestinations.peakTouristMonths
      })
      .from(seasonalDestinations)
      .where(eq(seasonalDestinations.destinationId, parseInt(destinationId, 10)));
    
    if (!seasonalInfo) {
      return res.status(404).json({ 
        message: 'Peak tourist months information not found for this destination' 
      });
    }
    
    // Format the response with month names for better readability
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const peakMonthsWithNames = seasonalInfo.peakMonths.map(monthNum => ({
      number: monthNum,
      name: monthNames[monthNum - 1]
    }));
    
    res.json({
      destinationId: parseInt(destinationId, 10),
      peakTouristMonths: seasonalInfo.peakMonths,
      peakTouristMonthsFormatted: peakMonthsWithNames,
      totalPeakMonths: seasonalInfo.peakMonths.length
    });
  } catch (error) {
    console.error('Error fetching peak tourist months:', error);
    res.status(500).json({ message: 'Failed to fetch peak tourist months' });
  }
});

// Create or update seasonal information for a destination
router.post('/seasonal/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const {
      summerStart,
      summerEnd,
      winterStart,
      winterEnd,
      shoulderPeriods,
      peakTouristMonths,
      weatherAlerts,
      majorEvents,
      nextUpdateDue
    } = req.body;
    
    // Check if destination exists
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(destinationId, 10)));
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if seasonal info already exists
    const [existingInfo] = await db
      .select()
      .from(seasonalDestinations)
      .where(eq(seasonalDestinations.destinationId, parseInt(destinationId, 10)));
    
    // Prepare data with JSON stringification for appropriate fields
    const seasonalData = {
      destinationId: parseInt(destinationId, 10),
      summerStart,
      summerEnd,
      winterStart,
      winterEnd,
      shoulderPeriods: JSON.stringify(shoulderPeriods),
      peakTouristMonths,
      weatherAlerts,
      majorEvents: JSON.stringify(majorEvents),
      nextUpdateDue: nextUpdateDue ? new Date(nextUpdateDue) : undefined
    };
    
    let result;
    
    if (existingInfo) {
      // Update existing record
      result = await db
        .update(seasonalDestinations)
        .set({
          ...seasonalData,
          lastUpdated: new Date()
        })
        .where(eq(seasonalDestinations.id, existingInfo.id))
        .returning();
    } else {
      // Insert new record
      result = await db
        .insert(seasonalDestinations)
        .values({
          ...seasonalData,
          lastUpdated: new Date()
        })
        .returning();
    }
    
    res.status(200).json({
      message: existingInfo ? 'Seasonal information updated' : 'Seasonal information created',
      data: result[0]
    });
  } catch (error) {
    console.error('Error saving seasonal information:', error);
    res.status(500).json({ message: 'Failed to save seasonal information' });
  }
});

export default router;
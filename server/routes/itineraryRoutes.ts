// server/routes/itineraryRoutes.ts
import { Router } from 'express';
import { db } from '../db';
import { userPurchases, itineraryTemplates, destinations } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { itineraryGeneratorFactory } from '../services/itineraryGeneratorFactory';

const router = Router();

// Handle itinerary purchase and generation
router.post('/api/purchase-itinerary', async (req, res) => {
  const { userId, email, destinationId, templateId, paymentId, paymentAmount } = req.body;
  
  try {
    // 1. Record the purchase in database
    const [purchaseResult] = await db.insert(userPurchases)
      .values({
        userId,
        email,
        destinationId,
        templateId,
        paymentId,
        paymentAmount,
        status: 'processing'
      })
      .returning({ id: userPurchases.id });
    
    const purchaseId = purchaseResult.id;
    
    // 2. Generate itinerary asynchronously
    // For production, consider using a queue system like Bull or AWS SQS
    setTimeout(async () => {
      try {
        // Get destination details first
        const destination = await db.query.destinations.findFirst({
          where: eq(destinations.id, destinationId)
        });
        
        if (!destination) {
          throw new Error(`Destination with ID ${destinationId} not found`);
        }
        
        // Use the factory to get the generator and generate content
        await itineraryGeneratorFactory.generateItinerary(destination, 'efficient');
        
        // Send email notification when complete
        // await emailService.sendItineraryEmail(email, pdfUrl);
      } catch (error) {
        console.error('Error in background itinerary generation:', error);
      }
    }, 0);
    
    // 3. Return immediate response to client
    res.json({
      success: true,
      message: 'Itinerary purchase recorded and generation started',
      purchaseId
    });
    
  } catch (error: any) {
    console.error('Error processing itinerary purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process itinerary purchase',
      error: error.message
    });
  }
});

// Check generation status
router.get('/api/itinerary-status/:purchaseId', async (req, res) => {
  const { purchaseId } = req.params;
  
  try {
    const purchase = await db.query.userPurchases.findFirst({
      where: eq(userPurchases.id, parseInt(purchaseId))
    });
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    res.json({
      success: true,
      status: purchase.status,
      pdfUrl: purchase.pdfUrl,
      completedAt: purchase.completedAt
    });
    
  } catch (error: any) {
    console.error('Error checking itinerary status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check itinerary status',
      error: error.message
    });
  }
});

export default router;
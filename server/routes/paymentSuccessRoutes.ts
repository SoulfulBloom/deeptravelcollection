import { Router } from 'express';
import { db } from '../db';
import { userPurchases } from '@shared/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Route to record successful payment
router.post('/record-payment', async (req, res) => {
  try {
    const { paymentIntentId, email, productType, destinationId, templateId, amount } = req.body;
    
    if (!paymentIntentId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and email are required'
      });
    }
    
    // Verify payment with Stripe
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        // Check if payment was successful
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({
            success: false,
            message: 'Payment has not been completed successfully'
          });
        }
        
        // Update or create purchase record
        const existingPurchase = await db
          .select()
          .from(userPurchases)
          .where(eq(userPurchases.stripeSessionId, paymentIntentId))
          .limit(1);
        
        if (existingPurchase.length > 0) {
          // Update existing purchase record
          await db
            .update(userPurchases)
            .set({
              status: 'completed',
              completedAt: new Date(),
              amount: (parseFloat(amount) || parseFloat(paymentIntent.amount_received) / 100).toString(),
            })
            .where(eq(userPurchases.stripeSessionId, paymentIntentId));
        } else {
          // Create new purchase record
          const destId = destinationId ? parseInt(destinationId) : null;
          const templId = templateId ? parseInt(templateId) : null;
          
          await db.insert(userPurchases).values({
            email,
            userId: 1, // Guest user ID
            destinationId: destId,
            templateId: templId,
            amount: (parseFloat(amount) || parseFloat(paymentIntent.amount_received) / 100).toString(),
            status: 'completed',
            stripeSessionId: paymentIntentId,
            completedAt: new Date()
          });
        }
        
        return res.json({
          success: true,
          message: 'Payment record updated successfully'
        });
      } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({
          success: false,
          message: 'Error verifying payment with Stripe'
        });
      }
    } else {
      // No Stripe, just record the payment 
      const destId = destinationId ? parseInt(destinationId) : null;
      const templId = templateId ? parseInt(templateId) : null;
      
      // Create or update purchase record
      const existingPurchase = await db
        .select()
        .from(userPurchases)
        .where(eq(userPurchases.stripeSessionId, paymentIntentId))
        .limit(1);
        
      if (existingPurchase.length > 0) {
        // Update existing purchase record
        await db
          .update(userPurchases)
          .set({
            status: 'completed',
            completedAt: new Date(),
            amount: (parseFloat(amount) || 19.99).toString(),
          })
          .where(eq(userPurchases.stripeSessionId, paymentIntentId));
      } else {
        // Create new purchase record
        await db.insert(userPurchases).values({
          email,
          userId: 1, // Guest user ID
          destinationId: destId,
          templateId: templId,
          amount: parseFloat(amount) || 19.99,
          status: 'completed',
          stripeSessionId: paymentIntentId,
          completedAt: new Date()
        });
      }
      
      return res.json({
        success: true,
        message: 'Payment record created successfully'
      });
    }
  } catch (error) {
    console.error('Error recording payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route to get payment details 
router.get('/details/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Check our database first
    const purchase = await db
      .select()
      .from(userPurchases)
      .where(eq(userPurchases.stripeSessionId, paymentId))
      .limit(1);
    
    if (purchase.length > 0) {
      return res.json({
        success: true,
        payment: purchase[0]
      });
    }
    
    // If not in database but Stripe is available, check Stripe
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        
        return res.json({
          success: true,
          payment: {
            stripeSessionId: paymentId,
            email: paymentIntent.receipt_email,
            amount: parseFloat(paymentIntent.amount_received) / 100,
            status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
            createdAt: new Date(paymentIntent.created * 1000),
            metadata: paymentIntent.metadata
          }
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
    }
    
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  } catch (error) {
    console.error('Error getting payment details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
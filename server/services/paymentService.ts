import Stripe from 'stripe';
import { db } from '../db';
import { userPurchases } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { UserPurchase } from '@shared/schema';

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Verify that a purchase is completed and valid
 */
export async function verifyPurchase(sessionId: string): Promise<UserPurchase | null> {
  try {
    // Check if the purchase exists in our database
    const [purchase] = await db
      .select()
      .from(userPurchases)
      .where(eq(userPurchases.stripeSessionId, sessionId));
    
    if (!purchase) {
      return null;
    }
    
    // If the purchase is already marked as completed, return it
    if (purchase.status === 'completed') {
      return purchase;
    }
    
    // Otherwise, verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // If payment is complete, update our record
    if (session.payment_status === 'paid') {
      const updatedPurchase = await db
        .update(userPurchases)
        .set({
          status: 'completed',
          completedAt: new Date(),
        })
        .where(eq(userPurchases.stripeSessionId, sessionId))
        .returning();
      
      return updatedPurchase[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return null;
  }
}

/**
 * Get a purchase by session ID
 */
export async function getPurchaseBySessionId(sessionId: string): Promise<UserPurchase | null> {
  try {
    const [purchase] = await db
      .select()
      .from(userPurchases)
      .where(eq(userPurchases.stripeSessionId, sessionId));
    
    return purchase || null;
  } catch (error) {
    console.error('Error getting purchase:', error);
    return null;
  }
}

/**
 * Create a new purchase record (without payment)
 */
export async function createPurchaseRecord(
  userId: number,
  email: string,
  destinationId: number,
  templateId: number,
  amount: number,
  stripeSessionId: string
): Promise<UserPurchase | null> {
  try {
    const [purchase] = await db
      .insert(userPurchases)
      .values({
        userId: userId,
        email,
        destinationId,
        templateId,
        amount,
        status: 'pending',
        stripeSessionId,
      })
      .returning();
    
    return purchase;
  } catch (error) {
    console.error('Error creating purchase record:', error);
    return null;
  }
}

/**
 * Mark a purchase as completed
 */
export async function completePurchase(sessionId: string): Promise<UserPurchase | null> {
  try {
    const [purchase] = await db
      .update(userPurchases)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(userPurchases.stripeSessionId, sessionId))
      .returning();
    
    return purchase;
  } catch (error) {
    console.error('Error completing purchase:', error);
    return null;
  }
}

/**
 * Refund a purchase
 */
export async function refundPurchase(sessionId: string, reason?: string): Promise<boolean> {
  try {
    const [purchase] = await db
      .select()
      .from(userPurchases)
      .where(eq(userPurchases.stripeSessionId, sessionId));
    
    if (!purchase) {
      return false;
    }
    
    // Get the payment intent from the session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    
    if (!session.payment_intent) {
      return false;
    }
    
    // Issue the refund
    await stripe.refunds.create({
      payment_intent: typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent.id,
      reason: (reason as 'duplicate' | 'fraudulent' | 'requested_by_customer' | undefined) || 'requested_by_customer',
    });
    
    // Update the purchase record
    await db
      .update(userPurchases)
      .set({
        status: 'refunded',
      })
      .where(eq(userPurchases.stripeSessionId, sessionId));
    
    return true;
  } catch (error) {
    console.error('Error refunding purchase:', error);
    return false;
  }
}
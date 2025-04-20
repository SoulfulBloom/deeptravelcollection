import { Router } from 'express';
import { db } from '../db';
import { userPurchases } from '@shared/schema';

const router = Router();

// Get all user purchase records
router.get('/purchases', async (req, res) => {
  try {
    // Fetch all purchase records from the database
    const purchases = await db
      .select()
      .from(userPurchases)
      .orderBy(userPurchases.createdAt);
    
    return res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchase records:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch purchase records' 
    });
  }
});

export default router;
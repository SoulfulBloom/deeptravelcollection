import { db } from './db';
import { sql } from 'drizzle-orm';

async function updateSchema() {
  try {
    console.log('Adding jobId column to user_purchases table...');
    
    // Check if column already exists
    const checkResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_purchases'
      AND column_name = 'job_id'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add the jobId column
      await db.execute(sql`
        ALTER TABLE user_purchases 
        ADD COLUMN job_id VARCHAR(255)
      `);
      
      // Add stripeSessionId column if it doesn't exist
      const checkSessionColumn = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_purchases'
        AND column_name = 'stripe_session_id'
      `);
      
      if (checkSessionColumn.rows.length === 0) {
        await db.execute(sql`
          ALTER TABLE user_purchases 
          ADD COLUMN stripe_session_id VARCHAR(255)
        `);
      }
      
      // Add amount column if it doesn't exist
      const checkAmountColumn = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_purchases'
        AND column_name = 'amount'
      `);
      
      if (checkAmountColumn.rows.length === 0) {
        await db.execute(sql`
          ALTER TABLE user_purchases 
          ADD COLUMN amount DECIMAL(10, 2)
        `);
      }
      
      console.log('Schema updated successfully');
    } else {
      console.log('Column jobId already exists');
    }
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    process.exit(0);
  }
}

updateSchema();
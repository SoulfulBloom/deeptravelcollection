import { db } from './db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // Add the new columns to destinations table
    console.log('Adding new columns to destinations table...');
    await db.execute(sql`
      ALTER TABLE destinations 
      ADD COLUMN IF NOT EXISTS best_time_to_visit TEXT,
      ADD COLUMN IF NOT EXISTS local_tips TEXT,
      ADD COLUMN IF NOT EXISTS geography TEXT,
      ADD COLUMN IF NOT EXISTS culture TEXT,
      ADD COLUMN IF NOT EXISTS cuisine TEXT
    `);
    
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the function
runMigration().then(() => {
  console.log('Migration script completed');
  process.exit(0);
}).catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
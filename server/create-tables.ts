// server/create-tables.ts
import { db, pool } from './db';

async function createTables() {
  try {
    console.log('Creating new tables...');
    
    // First check if enum already exists
    const enumCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'purchase_status'
      );
    `);
    
    if (!enumCheck.rows[0].exists) {
      console.log('Creating purchase_status enum type...');
      await pool.query(`
        CREATE TYPE purchase_status AS ENUM ('pending', 'processing', 'generating', 'completed', 'failed');
      `);
    }
    
    // Check if tables exist
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'itinerary_templates'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating itinerary_templates table...');
      await pool.query(`
        CREATE TABLE itinerary_templates (
          id SERIAL PRIMARY KEY,
          destination_id INTEGER REFERENCES destinations(id),
          duration_days INTEGER NOT NULL,
          theme VARCHAR(100),
          prompt_template TEXT NOT NULL,
          style_guide TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    
    // Check if user_purchases exists
    const purchasesCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_purchases'
      );
    `);
    
    if (!purchasesCheck.rows[0].exists) {
      console.log('Creating user_purchases table...');
      await pool.query(`
        CREATE TABLE user_purchases (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          email VARCHAR(255) NOT NULL,
          destination_id INTEGER REFERENCES destinations(id),
          template_id INTEGER REFERENCES itinerary_templates(id),
          payment_id VARCHAR(255),
          payment_amount DECIMAL(10,2),
          pdf_url VARCHAR(255),
          status purchase_status DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP
        );
      `);
    }
    
    console.log('Tables created successfully!');
    
    // Check tables after creation
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('itinerary_templates', 'user_purchases');
    `);
    
    console.log('Confirmed tables:', tables.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();
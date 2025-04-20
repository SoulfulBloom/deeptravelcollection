// server/migrations/add_template_tables.ts
import { sql } from 'drizzle-orm';
import { db } from '../db';

export async function up() {
  await sql`
    CREATE TYPE purchase_status AS ENUM ('pending', 'processing', 'generating', 'completed', 'failed');
    
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
  `;
}

export async function down() {
  await sql`
    DROP TABLE IF EXISTS user_purchases;
    DROP TABLE IF EXISTS itinerary_templates;
    DROP TYPE IF EXISTS purchase_status;
  `;
}
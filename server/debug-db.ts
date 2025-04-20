// server/debug-db.ts
import { db, pool } from './db';
import * as schema from '../shared/schema';

async function debugDatabase() {
  try {
    console.log('Debugging database connection...');
    
    // Check connection
    const connectionResult = await pool.query('SELECT current_database(), current_user;');
    console.log('Database connection:', connectionResult.rows[0]);
    
    // List tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Available tables:', tables.rows.map(row => row.table_name));
    
    // Try to query some data
    try {
      console.log('Attempting to query regions...');
      const regions = await db.query.regions.findMany();
      console.log('Regions count:', regions.length);
      console.log('First region (if any):', regions[0] || 'No regions found');
    } catch (error) {
      console.error('Error querying regions:', error);
    }
    
    // Check if our queries have proper relations
    console.log('Checking query capabilities...');
    console.log('schema.relations:', Object.keys(schema));
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await pool.end();
  }
}

debugDatabase();
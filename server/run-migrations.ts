// server/run-migrations.ts
import { up as addTemplateTables } from './migrations/add_template_tables';

async function runMigrations() {
  try {
    console.log('Running migrations...');
    
    // Run each migration in sequence
    await addTemplateTables();
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
import { seedCollections } from './seed-collections';

async function setupCollections() {
  try {
    console.log('Setting up collections...');
    await seedCollections();
    console.log('Collections setup completed successfully');
  } catch (error) {
    console.error('Error setting up collections:', error);
    process.exit(1);
  }
}

setupCollections();
import { initializeDatabase } from '@/utils/dbInit.ts';

async function main() {
  console.log('Initializing database...');
  await initializeDatabase();
  console.log('Database initialization complete');
  process.exit(0);
}

main().catch(error => {
  console.error('Error initializing database:', error);
  process.exit(1);
});
import { initializeDatabase } from '@/utils/dbInit.ts';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables with better error handling
const stackEnvPath = path.resolve(process.cwd(), 'stack.env');
if (fs.existsSync(stackEnvPath)) {
  console.log(`Loading environment from: ${stackEnvPath}`);
  dotenv.config({ path: stackEnvPath });
} else {
  console.log('stack.env not found, using default environment variables');
  dotenv.config();
}

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
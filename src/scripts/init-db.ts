import { initializeDatabase } from '@/utils/dbInit.ts';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const stackEnvPath = process.env.STACK_ENV_PATH || path.resolve('/data/stack.env');

if (fs.existsSync(stackEnvPath)) {
  console.log(`Loading environment from: ${stackEnvPath}`);
  dotenv.config({ path: stackEnvPath });
} else {
  console.log(`Stack env file not found at ${stackEnvPath}, falling back to default .env`);
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
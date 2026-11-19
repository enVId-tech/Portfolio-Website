import { MongoClient, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'stack.env'), quiet: true });

// Database configuration with fallbacks
const config = {
  // Use environment variables with fallbacks to prevent undefined errors
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  DB_NAME: process.env.CLIENT_DB || 'blogs'
};

// The pending connection is kept on globalThis so concurrent requests share a single client
// and development hot reloads do not open a new connection pool each time.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export async function connectToDatabase() {
  if (!config.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable in .env.local'
    );
  }

  if (!globalForMongo._mongoClientPromise) {
    const options: MongoClientOptions = {};
    const client = new MongoClient(config.MONGODB_URI, options);

    globalForMongo._mongoClientPromise = client.connect().catch((error) => {
      // Do not cache a failed connection, so the next request tries again
      globalForMongo._mongoClientPromise = undefined;
      console.error('Failed to connect to database:', error);
      throw error;
    });
  }

  const client = await globalForMongo._mongoClientPromise;

  return {
    client,
    db: client.db(config.DB_NAME)
  };
}

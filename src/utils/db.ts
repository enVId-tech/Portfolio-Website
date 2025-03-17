import { MongoClient, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'stack.env') });

// Database configuration with fallbacks
const config = {
  // Use environment variables with fallbacks to prevent undefined errors
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  DB_NAME: process.env.CLIENT_DB || 'blogs'
};

// Cached connection
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return {
      client: cachedClient,
      db: cachedClient.db(config.DB_NAME)
    };
  }

  if (!config.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable in .env.local'
    );
  }

  const options: MongoClientOptions = {};
  const client = new MongoClient(config.MONGODB_URI, options);

  try {
    await client.connect();
    cachedClient = client;

    return {
      client,
      db: client.db(config.DB_NAME)
    };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}
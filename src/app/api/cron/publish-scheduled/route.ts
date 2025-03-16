import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Handle environment variables first
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from stack.env
dotenv.config({ path: path.resolve(process.cwd(), 'stack.env') });

export const dynamic = 'force-dynamic'; // No caching for cron endpoints

export async function GET(request: NextRequest) {
  try {
    // Safety check for CRON_SECRET - make sure it exists before using it
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && (!authHeader || authHeader !== `Bearer ${cronSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make sure MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined');
      return NextResponse.json({ error: 'Database connection string not found' }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();
    const db = client.db(process.env.CLIENT_DB || 'blogs');
    const collection = db.collection('blogs');

    const now = new Date();

    const result = await collection.updateMany(
      {
        scheduledPublish: { $lte: now.toISOString() },
        publishStatus: 'private'
      },
      {
        $set: { publishStatus: 'published' }
      }
    );

    await client.close();

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
    return NextResponse.json({ success: false, error: 'Failed to publish scheduled posts' }, { status: 500 });
  }
}
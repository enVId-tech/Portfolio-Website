import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    await client.connect();
    const db = client.db(process.env.CLIENT_DB);
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

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
    return NextResponse.json({ success: false, error: 'Failed to publish scheduled posts' }, { status: 500 });
  } finally {
    await client.close();
  }
}
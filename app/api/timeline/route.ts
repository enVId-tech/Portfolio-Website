import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';

// Aggressive caching: revalidate every 20 minutes
export const revalidate = 1200;

// Get all repositories (both included and excluded)
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('timeline');

    const timelineItems = await collection.find().toArray();

    if (!timelineItems || timelineItems.length === 0) {
      return NextResponse.json(
          {
            success: false,
            error: 'No timeline items found'
          }
      );
    }

    return NextResponse.json({
      success: true,
      timelineItems
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching github-repos:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to fetch github-repos' },
        { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/utils/db.ts';

// Aggressive caching: revalidate every 10 minutes for individual blog posts
export const revalidate = 600;

// Type to represent blogs data
interface BlogData {
  id?: string;
  title?: string;
  content?: string;
  _id?: ObjectId;
  [key: string]: unknown;
}

// Helper function for getting a collection from the shared database connection
async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Get a specific blogs by slug
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  const id = (await params).slug;

  try {
    const collection = await getCollection('blogs');

    const blog = await collection.findOne({ id: id });

    if (!blog) {
      return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to fetch blogs' },
        { status: 500 }
    );
  }
}

// Update a specific blogs by slug
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  const id = (await params).slug;

  if (!id) {
    return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
    );
  }

  try {
    const data: BlogData = await req.json();
    const collection = await getCollection('blogs');

    // Remove _id from update data if it exists
    if (data._id) delete data._id;

    const result = await collection.updateOne(
        { id: id },
        { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: result.modifiedCount > 0
    });
  } catch (error) {
    console.error('Error updating blogs:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to update blogs' },
        { status: 500 }
    );
  }
}

// Delete a specific blogs by slug
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  const id = (await params).slug;

  try {
    const collection = await getCollection('blogs');

    const result = await collection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blogs:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to delete blogs' },
        { status: 500 }
    );
  }
}
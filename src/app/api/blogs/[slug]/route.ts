import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// Type to represent blog data
interface BlogData {
  id?: string;
  title?: string;
  content?: string;
  _id?: ObjectId;
  [key: string]: unknown;
}

// Helper function for database connection
async function getCollection(collectionName: string) {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  const db = client.db(process.env.CLIENT_DB);
  return { collection: db.collection(collectionName), client };
}

// Get a specific blog by slug
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  const id = (await params).slug;
  let client;

  try {
    const { collection, client: dbClient } = await getCollection('blogs');
    client = dbClient;

    const blog = await collection.findOne({ id: id });

    if (!blog) {
      return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to fetch blog' },
        { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// Update a specific blog by slug
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  const id = (await params).slug;
  let client;

  if (!id) {
    return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
    );
  }

  try {
    const data: BlogData = await req.json();
    const { collection, client: dbClient } = await getCollection('blogs');
    client = dbClient;

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
    console.error('Error updating blog:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to update blog' },
        { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// Delete a specific blog by slug
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  let client;

  const id = (await params).slug;

  try {
    const { collection, client: dbClient } = await getCollection('blogs');
    client = dbClient;

    const result = await collection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to delete blog' },
        { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
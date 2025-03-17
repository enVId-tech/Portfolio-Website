import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import {connectToDatabase} from "@/utils/db.ts";

// Get all blogs or filtered by tag
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tagFilter = url.searchParams.get('tag');

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogs');

    const query: Record<string, unknown> = {};

    if (tagFilter) {
      query.tags = tagFilter;
    }

    const blogs = await collection.find(query).sort({ date: -1 }).toArray();

    // Process scheduled posts
    const updatedBlogs = blogs.map(blog => {
      if (blog.scheduledPublish && new Date(blog.scheduledPublish) <= new Date() && blog.publishStatus === 'private') {
        collection.updateOne(
            { id: blog.id },
            { $set: { publishStatus: 'published' } }
        );
        return { ...blog, publishStatus: 'published' };
      }
      return blog;
    });

    return NextResponse.json({ success: true, blogs: updatedBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to fetch blogs' },
        { status: 500 }
    );
  }
}

// Create a new blogs post
export async function POST(request: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    // Only parse the body once
    const data = await request.json();

    await client.connect();
    const db = client.db(process.env.CLIENT_DB);
    const collection = db.collection('blogs');

    // Generate slug from title if not provided
    if (!data.id) {
      data.id = data.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
    }

    // Set date if not provided
    if (!data.date) {
      data.date = new Date().toISOString();
    }

    // Check scheduled publish date
    if (data.scheduledPublish) {
      const scheduledDate = new Date(data.scheduledPublish);
      const now = new Date();

      if (scheduledDate > now) {
        data.publishStatus = 'private';
      } else if (scheduledDate <= now) {
        data.publishStatus = 'published';
      }
    }

    // Set default values
    const newBlog = {
      ...data,
      tags: data.tags || []
    };

    const result = await collection.insertOne(newBlog);

    return NextResponse.json({
      success: true,
      blog: { ...newBlog, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating blogs:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blogs post' }, { status: 500 });
  } finally {
    await client.close();
  }
}
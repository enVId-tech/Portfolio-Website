import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';

// Get all repositories (both included and excluded)
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('githubRepos');

    const repoSettings = await collection.find().toArray();

    if (!repoSettings) {
      return NextResponse.json(
          {
            success: true,
            includedRepos: [],
            excludedRepos: ["enVId-tech"] // Default excluded
          }
      );
    }

    return NextResponse.json({
      success: true,
      includedRepos: repoSettings[0].includedRepos || [],
      excludedRepos: repoSettings[1].excludedRepos || ["enVId-tech"]
    });
  } catch (error) {
    console.error('Error fetching github-repos:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to fetch github-repos' },
        { status: 500 }
    );
  }
}

// Update repository lists
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { db } = await connectToDatabase();
    const collection = db.collection('githubRepos');

    // Prepare update data with both repository lists
    const updateData: { includedRepos?: string[]; excludedRepos?: string[] } = {};

    if (Array.isArray(data.includedRepos)) {
      updateData.includedRepos = data.includedRepos;
    }

    if (Array.isArray(data.excludedRepos)) {
      updateData.excludedRepos = data.excludedRepos;
    }

    const result = await collection.updateOne(
        { type: 'repoSettings' },
        { $set: updateData },
        { upsert: true }
    );

    return NextResponse.json({
      success: true,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    console.error('Error updating github-repos:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to update github-repos' },
        { status: 500 }
    );
  }
}
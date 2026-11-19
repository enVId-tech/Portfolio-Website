import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db.ts';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('admin');

    // Check if the username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Username already exists'
      }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user
    const newUser = {
      username,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if not specified
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during registration'
    }, { status: 500 });
  }
}
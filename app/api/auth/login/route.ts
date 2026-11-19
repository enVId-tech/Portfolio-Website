import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('admin');

    // Find user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    // User structure to compare to:
    // {
    //   _id: ObjectId,
    //   username: string,
    //   password: string,
    //   role: string
    // }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id.toString(), username: user.username, role: user.role || 'user' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        username: user.username,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
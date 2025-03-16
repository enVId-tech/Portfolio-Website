import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.CLIENT_DB || 'admin');
    const usersCollection = db.collection('admin');

    // Find user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      await client.close();
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
      await client.close();
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id.toString(), username: user.username, role: user.role || 'user' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    await client.close();

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
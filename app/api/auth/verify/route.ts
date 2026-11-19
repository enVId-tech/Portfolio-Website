import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/utils/db.ts';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };

            const { db } = await connectToDatabase();
            const usersCollection = db.collection('users');

            // Verify user exists
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });

            if (!user) {
                return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                user: {
                    username: user.username,
                    role: user.role || 'user'
                }
            });

        } catch (error) {
            console.error('Verification error:', error);
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
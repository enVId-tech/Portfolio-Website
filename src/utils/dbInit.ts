import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.CLIENT_DB || 'blog';

export async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(DB_NAME);

        // Check if users collection exists and has any users
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();

        // If no users, create admin user
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await usersCollection.insertOne({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date()
            });

            console.log('Admin user created successfully');
        }

        await client.close();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}
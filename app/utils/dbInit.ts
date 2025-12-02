import bcrypt from 'bcryptjs';
import {connectToDatabase} from "@/utils/db.ts";

export async function initializeDatabase() {
    try {
        // Connect to the database
        const { client, db } = await connectToDatabase();

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
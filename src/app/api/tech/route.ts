import {connectToDatabase} from "@/utils/db.ts";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();

        const techCollection = db.collection('technology');
        const tech = await techCollection.find().toArray();

        const cleanedTech = tech.map(item => {
            const { _id, ...techWithoutId } = item;

            return techWithoutId;
        });

        return NextResponse.json({ success: true, tech: cleanedTech });
    } catch (err: unknown) {
        console.error('Error fetching tech:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tech' },
            { status: 500 }
        );
    }
}
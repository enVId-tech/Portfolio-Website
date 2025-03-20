import {connectToDatabase} from "@/utils/db.ts";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const techCollection = db.collection('technology');
        const tech = await techCollection.find().toArray();

        let id: string = "";

        const cleanedTech = tech.map(item => {
            const { _id, ...techWithoutId } = item;

            id += `-${_id}`;

            return techWithoutId;
        });

        return NextResponse.json({ success: true, tech: cleanedTech, _id: id });
    } catch (err: unknown) {
        console.error('Error fetching tech:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tech' },
            { status: 500 }
        );
    }
}
"use server"
import React from "react";
import { MongoClient } from 'mongodb';
import DotBackground from "@/app/_components/dotbackground";
import Header from "@/app/_components/header";
import About from "@/app/_components/about";
import Timeline from "@/app/_components/timeline";
import Projects from "@/app/_components/projects";
import Technology from "@/app/_components/technology";
import Footer from "@/app/_components/footer";
import ScrollToTop from "@/app/_components/scrollToTop";
import SectionSelector from "@/app/_components/sectionSelector";
import Blogs from "@/app/_components/blogs";
import { BlogInterface } from "@/models/Blog";

export default async function HomePage(): Promise<React.ReactElement> {
    const sections = [
        { id: "header", label: "Home" },
        { id: "about", label: "About" },
        { id: "timeline", label: "Timeline" },
        { id: "projects", label: "Projects" },
        { id: "blogs", label: "Blogs" },
        { id: "technology", label: "Skills" }
    ];

    // Fetch 4 most recent blogs
    const recentBlogs = await getRecentBlogs(4);

    return (
        <>
            <SectionSelector sections={sections} />
            <DotBackground config={{
                spacingBetweenDots: 40,
                dotSize: 1.2,
                dotColor: 'rgb(200, 200, 255)',
                dotOpacity: 0.3,
                maxDistance: 150,
                friction: 0.8, // WARNING: Do NOT use values greater than 0.8.
            }}>
                <Header/>
                <About />
                <Timeline/>
                <Projects/>
                <Blogs blogPosts={recentBlogs}/>
                <Technology/>
                <Footer/>
                <ScrollToTop/>
            </DotBackground>
        </>
    )
}

async function getRecentBlogs(limit: number): Promise<BlogInterface[]> {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const DB_NAME = process.env.CLIENT_DB || 'blog';

        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(DB_NAME);
        const blogsCollection = db.collection('blogs');

        // Find published blogs, sorted by date (newest first)
        const blogs = await blogsCollection.find({
            publishStatus: 'published',
            $or: [
                { scheduledPublish: { $exists: false } },
                { scheduledPublish: null },
                { scheduledPublish: { $lte: new Date().toISOString() } }
            ]
        })
            .sort({ date: -1 })
            .limit(limit)
            .toArray();

        await client.close();

        return blogs.map(blog => ({
            ...blog,
            _id: blog._id.toString(),
        })) as BlogInterface[];
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return [];
    }
}
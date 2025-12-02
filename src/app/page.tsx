"use server"
import React from "react";
import DotBackground from "@/app/_components/dotbackground";
import Header from "@/app/_components/header";
import About from "@/app/_components/about";
import Timeline from "@/app/_components/timeline";
import Projects from "@/app/_components/projects";
import Technology from "@/app/_components/technology";
import Footer from "@/app/_components/footer";
import ScrollToTop from "@/app/_components/scrollToTop";
import SectionSelector from "@/app/_components/sectionSelector";
import { PersonSchema, WebsiteSchema, ProfessionalServiceSchema } from "@/utils/schemas";
import { Metadata } from "next";
// import BlogsComponent from "@/app/_components/blogsComponent.tsx";

export const metadata: Metadata = {
    title: "Home",
    description: "Erick Tran - Full Stack Developer with 3+ years of experience in React, Next.js, Node.js, TypeScript, and modern web technologies. View my portfolio of innovative web applications and development projects.",
    openGraph: {
        title: "Erick Tran - Full Stack Developer Portfolio",
        description: "Explore the portfolio of Erick Tran, a skilled full stack developer specializing in React, Next.js, Node.js, and modern web technologies.",
        url: "https://etran.dev",
        type: "website",
    },
};

export default async function HomePage(): Promise<React.ReactElement> {
    const sections = [
        { id: "header", label: "Home" },
        { id: "about", label: "About" },
        { id: "timeline", label: "Timeline" },
        // { id: "blogs", label: "Blogs" },
        { id: "technology", label: "Skills" },
        { id: "projects", label: "Projects" },
    ];

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([PersonSchema, WebsiteSchema, ProfessionalServiceSchema])
                }}
            />
            
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
                {/*<BlogsComponent/>*/}
                <Technology/>
                <Projects/>
                <Footer/>
                <ScrollToTop/>
            </DotBackground>
        </>
    )
}
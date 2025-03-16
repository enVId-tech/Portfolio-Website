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
import BlogsComponent from "@/app/_components/blogsComponent.tsx";

export default async function HomePage(): Promise<React.ReactElement> {
    const sections = [
        { id: "header", label: "Home" },
        { id: "about", label: "About" },
        { id: "timeline", label: "Timeline" },
        { id: "projects", label: "Projects" },
        { id: "blogs", label: "Blogs" },
        { id: "technology", label: "Skills" }
    ];

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
                <BlogsComponent/>
                <Technology/>
                <Footer/>
                <ScrollToTop/>
            </DotBackground>
        </>
    )
}
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

export default async function HomePage(): Promise<React.ReactElement> {
    return (
        <DotBackground config={{
            spacingBetweenDots: 40,
            dotSize: 1.1,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.3,
            maxDistance: 150,
            friction: 0.8, // WARNING: Do NOT use values greater than 0.8.
        }}>
            <Header/>
            <About />
            <Timeline/>
            <Projects/>
            <Technology/>
            <Footer/>
            <ScrollToTop/>
        </DotBackground>
    )
}
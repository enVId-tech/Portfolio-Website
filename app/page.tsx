import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import DotBackground from "@/_components/dotbackground";
import Header from "@/_components/header";
import SimpleLoading from "@/_components/simpleLoading";
import { PersonSchema, WebsiteSchema, ProfessionalServiceSchema } from "@/utils/schemas";
import { Metadata } from "next";

// Lazy load non-critical components with loading fallback
const About = dynamic(() => import("@/_components/about"), {
    loading: () => <SimpleLoading />,
    ssr: true,
});
const Timeline = dynamic(() => import("@/_components/timeline"), {
    loading: () => <SimpleLoading />,
    ssr: true,
});
const Technology = dynamic(() => import("@/_components/technology"), {
    loading: () => <SimpleLoading />,
    ssr: true,
});
const Projects = dynamic(() => import("@/_components/projects"), {
    loading: () => <SimpleLoading />,
    ssr: true,
});
const Footer = dynamic(() => import("@/_components/footer"), {
    loading: () => <SimpleLoading />,
    ssr: true,
});
const ScrollToTop = dynamic(() => import("@/_components/scrollToTop"));
const SectionSelector = dynamic(() => import("@/_components/sectionSelector"));

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
            
            <Suspense fallback={null}>
                <SectionSelector sections={sections} />
            </Suspense>
            
            <DotBackground config={{
                spacingBetweenDots: 40,
                dotSize: 1.2,
                dotColor: 'rgb(200, 200, 255)',
                dotOpacity: 0.3,
                maxDistance: 150,
                friction: 0.8, // WARNING: Do NOT use values greater than 0.8.
            }}>
                <Header/>
                
                <Suspense fallback={<SimpleLoading />}>
                    <About />
                </Suspense>
                
                <Suspense fallback={<SimpleLoading />}>
                    <Timeline/>
                </Suspense>
                
                <Suspense fallback={<SimpleLoading />}>
                    <Technology/>
                </Suspense>
                
                <Suspense fallback={<SimpleLoading />}>
                    <Projects/>
                </Suspense>
                
                <Suspense fallback={<SimpleLoading />}>
                    <Footer/>
                </Suspense>
                
                <Suspense fallback={null}>
                    <ScrollToTop/>
                </Suspense>
            </DotBackground>
        </>
    )
}
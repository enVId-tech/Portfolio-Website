import React from "react";
import Head from "next/head";
import styles from '@/styles/home.module.scss';
import TitleDiv from "@/templates/pages/titleDiv.section.tsx";
import About from "@/templates/pages/about.section.tsx";
import Footer from "@/templates/pages/footer.section.tsx";
import Projects from "@/templates/pages/projects.section.tsx";
import Resources from "@/templates/pages/resources.section";

// Images
import react from "@/public/images/logos/ReactJS.png";
import next from "@/public/images/logos/NextJS.png";
import node from "@/public/images/logos/NodeJS.png";
import js from "@/public/images/logos/JavaScript.png";
import mongo from "@/public/images/logos/MongoDB.png";
import express from "@/public/images/logos/ExpressJS.png";
import ts from "@/public/images/logos/TypeScript.png";
import python from "@/public/images/logos/Python.png";
import java from "@/public/images/logos/Java.png";
import cpp from "@/public/images/logos/Cpp.png";
import html from "@/public/images/logos/HTML.png";
import scss from "@/public/images/logos/SCSS.png";

const HomePage: React.FC = (): React.JSX.Element => {
    type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
    type AboutPropsType = { aboutScrollHeight: number; aboutText: string[]; };
    type ResourcesPropsType = { resources: { title: string; description: string; image: string; link: string; }[]; };
    type ProjectsPropType = { projects: { title: string; description: string; techStack: string[]; githubLink: string; liveLink: string; }[]; };
    type FooterPropsType = { latestUpdate: string; dateUpdated: string; brandName: string; };

    // Title Div
    const TitleProps: TitlePropsType = {
        titlePlate: `Hi! I'm Erick Tran.`,
        subTitlePlate: `Full stack web developer and engineer.`,
        titlePlateDelay: 45,
        subTitlePlateDelay: 40,
        timeBetweentitleAndSubTitle: 1050,
        waitTime: 350
    }

    // About
    const AboutProps: AboutPropsType = {
        aboutScrollHeight: 700,
        aboutText: [
            "4 years of full stack web development experience.",
            "Specialized in React, MongoDB, and Node.js.",
            "Self-studied software engineering, 6 years.",
            "Making innovative projects for the community."
        ]
    }

    // Resources
    const ResourcesProps: ResourcesPropsType = {
        resources: [
            {
                title: "ReactJS",
                description: "React is a JavaScript library for building user interfaces.",
                image: react.src,
                link: "https://reactjs.org"
            },
            {
                title: "NextJS",
                description: "Next.js is a React framework that enables functionality like server-side rendering and static site generation.",
                image: next.src,
                link: "https://nextjs.org"
            },
            {
                title: "NodeJS",
                description: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                image: node.src,
                link: "https://nodejs.org"
            },
            {
                title: "JavaScript",
                description: "JavaScript is a programming language that conforms to the ECMAScript specification.",
                image: js.src,
                link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
            },
            {
                title: "MongoDB",
                description: "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
                image: mongo.src,
                link: "https://www.mongodb.com"
            },
            {
                title: "ExpressJS",
                description: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
                image: express.src,
                link: "https://expressjs.com"
            },
            {
                title: "TypeScript",
                description: "TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.",
                image: ts.src,
                link: "https://www.typescriptlang.org"
            },
            {
                title: "Python",
                description: "Python is a programming language that lets you work quickly and integrate systems more effectively.",
                image: python.src,
                link: "https://www.python.org"
            },
            {
                title: "Java",
                description: "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
                image: java.src,
                link: "https://www.java.com"
            },
            {
                title: "C++",
                description: "C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or 'C with Classes'.",
                image: cpp.src,
                link: "https://www.cplusplus.com"
            },
            {
                title: "HTML",
                description: "HTML is the standard markup language for documents designed to be displayed in a web browser.",
                image: html.src,
                link: "https://developer.mozilla.org/en-US/docs/Web/HTML"
            },
            {
                title: "SASS/SCSS",
                description: "Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.",
                image: scss.src,
                link: "https://sass-lang.com"
            }
        ]
    }

    // Projects
    const ProjectProps: ProjectsPropType = {
        projects: [
            {
                title: "Project 1",
                description: "This is a project description.",
                techStack: ["React", "Node.js", "MongoDB"],
                githubLink: "https://github.com",
                liveLink: "https://github.com"
            },
            {
                title: "Project 2",
                description: "This is a project description.",
                techStack: ["React", "Node.js", "MongoDB"],
                githubLink: "https://github.com",
                liveLink: "https://github.com"
            },
            {
                title: "Project 3",
                description: "This is a project description.",
                techStack: ["React", "Node.js", "MongoDB"],
                githubLink: "https://github.com",
                liveLink: "https://github.com"
            }
        ]
    }

    // Footer
    const FooterProps: FooterPropsType = {
        latestUpdate: 'Update 9',
        dateUpdated: "July 5th, 2024",
        brandName: "enVId Tech"
    }

    return (
        <div className={styles.homePageMainDiv}>
            <Head>
                <title>enVId Tech - Home Page</title>
            </Head>
            <TitleDiv
                titlePlate={TitleProps.titlePlate as string}
                subTitlePlate={TitleProps.subTitlePlate as string}
                titlePlateDelay={TitleProps.titlePlateDelay as number}
                subTitlePlateDelay={TitleProps.subTitlePlateDelay as number}
                timeBetweentitleAndSubTitle={TitleProps.timeBetweentitleAndSubTitle as number}
                waitTime={TitleProps.waitTime as number}
            />
            <About aboutScrollHeight={AboutProps.aboutScrollHeight as number} aboutText={AboutProps.aboutText as string[]} />
            <Resources resources={ResourcesProps.resources as { title: string; description: string; image: string; link: string; }[]} />
            <Projects projects={ProjectProps.projects as { title: string; description: string; techStack: string[]; githubLink: string; liveLink: string; }[]} />
            <Footer
                latestUpdate={FooterProps.latestUpdate as string}
                dateUpdated={FooterProps.dateUpdated as string}
                brandName={FooterProps.brandName as string}
            />
        </div>
    );
};

export default HomePage;
import React from "react";
import Head from "next/head";
import styles from '@/styles/home.module.scss';
import TitleDiv from "@/templates/pages/titleDiv.section.tsx";
import About from "@/templates/pages/about.section.tsx";
import Footer from "@/templates/pages/footer.section.tsx";
import Projects from "@/templates/pages/projects.section.tsx";
import Resources from "@/templates/pages/resources.section";

const HomePage: React.FC = (): React.JSX.Element => {
    type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
    type AboutPropsType = { aboutScrollHeight: number; aboutText: string[]; };
    type ResourcesPropsType = { resources: { title: string; description: string; link: string; }[]; };
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
                title: "Resource 1",
                description: "This is a resource description.",
                link: "https://github.com"
            },
            {
                title: "Resource 2",
                description: "This is a resource description.",
                link: "https://github.com"
            },
            {
                title: "Resource 3",
                description: "This is a resource description.",
                link: "https://github.com"
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
            <Resources resources={ResourcesProps.resources as { title: string; description: string; link: string; }[]} />
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
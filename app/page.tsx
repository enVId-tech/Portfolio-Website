"use client";
import React from "react";
import Head from "next/head";
import styles from '@/styles/home.module.scss';
import TitleDiv from "@/components/titleDiv.section";
import About from "@/components/about.section";
import Footer from "@/components/footer.section";
import Projects from "@/components/projects.section";
import Resources from "@/components/resources.section";

// JSON Data
import { ResourcesProps } from "@/public/json/resources.section.ts";
import { AboutProps } from "@/public/json/about.section.ts";
import { TitleProps } from "@/public/json/title.section.ts";
import { ProjectProps } from "@/public/json/project.section.ts";
import { FooterProps } from "@/public/json/footer.section.ts";
import TopNavBar from "@/components/topNavBar.section";
import Contact from "@/components/contact.section";

const HomePage: React.FC = (): React.JSX.Element => {
    return (
        <div className={styles.homePageMainDiv}>
            <TopNavBar />
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
            <Projects projects={ProjectProps.projects as { title: string; description: string; embed: string; link: string; githubLink: string; techStack: string[]; }[]} />
            <Contact />
            <Footer
                latestUpdate={FooterProps.latestUpdate as string}
                dateUpdated={FooterProps.dateUpdated as string}
                brandName={FooterProps.brandName as string}
            />
        </div>
    );
};

export default HomePage;
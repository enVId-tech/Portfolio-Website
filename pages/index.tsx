import React from "react";
import Head from "next/head";
import styles from '@/styles/home.module.scss';
import TitleDiv from "@/templates/pages/titleDiv.section.tsx";
import About from "@/templates/pages/about.section.tsx";
import Footer from "@/templates/pages/footer.section.tsx";
import Projects from "@/templates/pages/projects.section.tsx";
import Resources from "@/templates/pages/resources.section";

// JSON Data
import { ResourcesProps } from "@/public/json/resources.section.ts";
import { AboutProps } from "@/public/json/about.section.ts";
import { TitleProps } from "@/public/json/title.section.ts";
import { ProjectProps } from "@/public/json/project.section.ts";
import { FooterProps } from "@/public/json/footer.section.ts";
import TopNavBar from "@/templates/pages/topNavBar.section";
import Contact from "@/templates/pages/contact.section";

const HomePage: React.FC = (): React.JSX.Element => {
    return (
        <div className={styles.homePageMainDiv}>
            <Head>
                <title>enVId Tech - Home Page</title>
            </Head>
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
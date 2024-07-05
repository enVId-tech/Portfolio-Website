import React from "react";
import Head from "next/head";
import styles from '@/styles/home.module.scss';
import TitleDiv from "@/templates/pages/titleDiv.section.tsx";
import About from "@/templates/pages/about.section.tsx";
import Footer from "@/templates/pages/footer.section.tsx";

const HomePage: React.FC = (): React.JSX.Element => {
    type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
    type AboutPropsType = { aboutScrollHeight: number; aboutText: string[]; };
    type FooterPropsType = { latestUpdate: string; dateUpdated: string; brandName: string; };

    // Title Div
    const TitleProps: TitlePropsType = {
        titlePlate: `Hi! I'm Erick Tran.`,
        subTitlePlate: `Full stack web developer and designer.`,
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
            <Footer
                latestUpdate={FooterProps.latestUpdate as string}
                dateUpdated={FooterProps.dateUpdated as string}
                brandName={FooterProps.brandName as string}
            />
        </div>
    );
};

export default HomePage;
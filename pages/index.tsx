import Head from 'next/head';
import React from 'react';
import styles from '@/styles/home.module.scss';
import Footer from '@/templates/pages/footer.section';
import TitleDiv from '@/templates/pages/titleDiv.section';
import About from '@/templates/pages/about.section';
import PaddingElement from '@/templates/pages/element.padding.section';

const HomePage: React.FC = (): JSX.Element => {
    type PaddingPropsType = { defaultPaddingHeight: number };
    type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
    type AboutPropsType = { aboutScrollHeight: number; aboutText: string[]; };
    type FooterPropsType = { latestUpdate: string; dateUpdated: string; brandName: string; };
    type ProjectsPropsType = { defaultShow: number; };

    // Padding
    const PaddingProps: PaddingPropsType = {
        defaultPaddingHeight: 15 // In vh
    }

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
            "3 years of full stack web development experience.",
            "Specialized in React, MongoDB, and Node.js.",
            "Self-studied in software.",
            "Making innovative projects for the community."
        ]
    }

    // Footer
    const FooterProps: FooterPropsType = {
        latestUpdate: '0.0.63',
        dateUpdated: "1-8-2024",
        brandName: "enVId Tech"
    }

    // Projects
    const ProjectsProps: ProjectsPropsType = {
        defaultShow: 24
    }

    return (
        <div className={styles.homePageMainDiv}>
            <Head>
                <title>enVId Tech - Home Page</title>
                <link href="/favicon/favicon.ico" type="image/x-icon" rel="icon" />
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
            <PaddingElement height={PaddingProps.defaultPaddingHeight as number} />
            <Footer
                latestUpdate={FooterProps.latestUpdate as string}
                dateUpdated={FooterProps.dateUpdated as string}
                brandName={FooterProps.brandName as string}
            />
        </div>
    )
};

export default HomePage;
import Head from 'next/head';
import React from 'react';
import styles from '@/styles/home.module.scss';
import Footer from '@/templates/footer.section.tsx';
import TitleDiv from '@/templates/titleDiv.section.tsx';
import About from '@/templates/about.section.tsx';
import ParticlesElement from '@/templates/animations/particles.effects.tsx';
import PaddingElement from '@/templates/element.padding.section.tsx';

const HomePage: React.FC = (): JSX.Element => {
    type PaddingPropsType = { defaultPaddingHeight: number };
    type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
    type AboutPropsType = { aboutScrollHeight: number; };
    type MyPathPropsType = { myPathScrollHeight: number; };
    type ProjectsPropsType = { projectsURLS: string[]; };
    type FooterPropsType = { latestUpdate: string; dateUpdated: string; brandName: string; };

    // Padding
    const PaddingProps: PaddingPropsType = {
        defaultPaddingHeight: 15 // In vh
    }

    // Title Div
    const TitleProps: TitlePropsType = {
        titlePlate: `Hi! I'm Erick Tran.`,
        subTitlePlate: `I am a software developer and engineer.`,
        titlePlateDelay: 45,
        subTitlePlateDelay: 40,
        timeBetweentitleAndSubTitle: 1050,
        waitTime: 350
    }

    // About
    const AboutProps: AboutPropsType = {
        aboutScrollHeight: 700
    }

    // My Path
    const MyPathProps: MyPathPropsType = {
        myPathScrollHeight: 1463
    }

    // Projects
    const ProjectsProps: ProjectsPropsType = {
        projectsURLS: []
    }

    // Footer
    const FooterProps: FooterPropsType = {
        latestUpdate: '0.0.50',
        dateUpdated: "12-5-2023",
        brandName: "enVId Tech"
    }

    return (
        <div className={styles.homePageMainDiv}>
            <ParticlesElement />
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
            <About aboutScrollHeight={AboutProps.aboutScrollHeight as number} />
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
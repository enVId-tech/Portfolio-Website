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
        subTitlePlate: `Full stack web developer and designer.`,
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
        latestUpdate: '0.0.61',
        dateUpdated: "1-7-2023",
        brandName: "enVId Tech"
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
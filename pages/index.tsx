import Head from 'next/head';
import React from 'react';
import styles from '@/styles/home.module.scss';
import Footer from '@/templates/footer.section.tsx';
import TitleDiv from '@/templates/titleDiv.section.tsx';
import About from '@/templates/about.section.tsx';
import ParticlesElement from '@/templates/animations/particles.effects.tsx';
import PaddingElement from '@/templates/element.padding.section.tsx';
import MyPath from '@/templates/mypath.section.tsx';

const HomePage: React.FC = (): JSX.Element => {
    return (
        <div className={styles.homePageMainDiv}>
            <ParticlesElement />
            <Head>
                <title>enVId Tech - Home Page</title>
                <link href="/favicon/favicon.ico" type="image/x-icon" rel="icon" />
            </Head>
            <TitleDiv 
                titlePlate={`Hi! I'm Erick Tran.`}
                subTitlePlate={`I am a software developer and engineer.`}
                titlePlateDelay={45}
                subTitlePlateDelay={40}
                timeBetweentitleAndSubTitle={1050}
                waitTime={350}
            />
            <About aboutScrollHeight={700} />
            <PaddingElement height={15} />
            <MyPath myPathScrollHeight={1463} />
            <PaddingElement height={15} />
            <Footer />
        </div>
    )
};

export default HomePage;
import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Footer from '@/templates/footer.section.tsx';
import TitleDiv from '@/templates/titleDiv.section.tsx';
import About from '@/templates/about.section.tsx';
import ParticlesElement from '@/templates/particles/particles.effects.tsx';
import PaddingElement from '@/templates/element.padding.section.tsx';

const HomePage: React.FC = (): JSX.Element => {
    return (
        <div className={styles.homePageMainDiv}>
            <ParticlesElement />
            <Head>
                <title>enVId Tech - Home Page</title>
                <link href="../public/favicon/favicon.ico" type="image/x-icon" rel="icon" />
            </Head>
            <TitleDiv 
                titlePlate={`Hi! I'm Erick Tran.`}
                subTitlePlate={`I am a software developer and engineer.`}
                titlePlateDelay={75}
                subTitlePlateDelay={40}
                timeBetweentitleAndSubTitle={1500}
            />
            <About />
            <PaddingElement height={10} />
            <Footer />
        </div>
    )
};

export default HomePage;
import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Footer from '@/templates/footer';
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = {
    weight: "300",
    style: 'normal',
    subsets: ['latin']
}

const HomePage: React.FC = (): JSX.Element => {
    try {
        return (
            <div className={styles.homePageMainDiv}>
                <Head>
                    <title>enVId Tech - Home Page</title>
                    <link href="../public/favicon/favicon.ico" type="image/x-icon" rel="icon"/>
                </Head>
                <div className={styles.titleDiv} id="homePageMainDivHeader">
                    <h1>Home Page</h1>
                    <h6>Latest Update: 11-9-2023, Revision 0.0.01</h6>
                </div>
                <Footer />
            </div>
        )
    } catch (err: unknown) {
        console.error(err as string);
        setTimeout((): void => {
            window.location.href = '/';
        }, 2000);
        return (
            <Head>
                <title>Redirecting...</title>
            </Head>
        )
    }
};

export default HomePage;
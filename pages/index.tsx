import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Footer from '@/templates/footer';
import { Work_Sans } from 'next/font/google';

const Work_Sans300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans500 = Work_Sans({
    weight: "500",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans600 = Work_Sans({
    weight: "600",
    style: 'normal',
    subsets: ['latin']
});

const HomePage: React.FC = (): JSX.Element => {
    const namePlate = React.useRef<HTMLHeadingElement>(null);
    const titlePlate = React.useRef<HTMLHeadingElement>(null);

    const name: string = "Erick Tran";
    const title: string = "Software Developer";

    if (!namePlate) {
        throw new Error("Name plate not found" as string);
    }

    if (!titlePlate) {
        throw new Error("Title plate not found" as string);
    }

    const animateText = (target: React.MutableRefObject<HTMLElement | null>, text: string, delay: number): void => {
        let i: number = 0;
        const intervalId: NodeJS.Timeout = setInterval((): void => {
            if (target.current !== null) {
                const currentText: string = target.current.innerHTML;
                if (currentText.includes(text) || currentText.length >= text.length) {
                    target.current.innerHTML = "";
                }

                target.current.innerHTML += text.charAt(i);
                i++;

                if (i === text.length) {
                    clearInterval(intervalId);
                }
            }
        }, delay);
    };

    setTimeout((): void => {
        animateText(namePlate, name, 150);
        animateText(titlePlate, title, 100);
    }, 250);

    try {
        return (
            <div className={styles.homePageMainDiv}>
                <Head>
                    <title>enVId Tech - Home Page</title>
                    <link href="../public/favicon/favicon.ico" type="image/x-icon" rel="icon" />
                </Head>
                <div className={styles.titleDiv} id="homePageMainDivHeader">
                    <h1 className={`${styles.namePlate} ${Work_Sans500.className}`} id="Name" ref={namePlate}></h1>
                    <h2 className={`${styles.subNamePlate} ${Work_Sans300.className}`} id="PersonTitle" ref={titlePlate}></h2>
                </div>
                <Footer />
            </div>
        )
    } catch (error: unknown) {
        console.error(error as string);
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
import React from "react";
import styles from "@/styles/titleDiv.module.scss";
import { Work_Sans, Montserrat } from "next/font/google";
import animateText from "@/templates/other/scrollEffect.ts";

const Work_Sans300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans500 = Work_Sans({
    weight: "500",
    style: 'normal',
    subsets: ['latin']
});

const Montserrat400 = Montserrat({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

interface TitleDivProps {
    title: string;
}

const TitleDiv: React.FC<TitleDivProps> = ({ title }): React.JSX.Element => {
    const namePlate: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    setTimeout((): void => {
        animateText(namePlate, title, 100);
    }, 1000);

    try {
        return (
            <div className={styles.titleDiv}>
                <p ref={namePlate} className={styles.namePlate}></p>
            </div>
        );
    } catch (error: unknown) {
        console.error(error as string);
        return <></>
    }
};

export default TitleDiv;
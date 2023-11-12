import React from 'react';
import styles from './scss/titleDiv.module.scss';
import { Work_Sans } from 'next/font/google';

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

interface TitleDivProps {
    titlePlate: string;
    subTitlePlate: string;
    titlePlateDelay: number;
    subTitlePlateDelay: number;
    timeBetweentitleAndSubTitle?: number;
}

const TitleDiv: React.FC<TitleDivProps> = (props: TitleDivProps): JSX.Element => {
    const namePlate = React.useRef<HTMLHeadingElement | null>(null);
    const titlePlate = React.useRef<HTMLHeadingElement | null>(null);

    const name: string = props.titlePlate.toString();
    const title: string = props.subTitlePlate.toString();

    if (!namePlate) {
        throw new Error("Name plate not found" as string);
    }

    if (!titlePlate) {
        throw new Error("Title plate not found" as string);
    }

    const animateText = (target: React.MutableRefObject<HTMLElement | null>, text: string, delay: number): void => {
        target.current!.innerHTML = "";
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
        animateText(namePlate, name, props.titlePlateDelay);
        if (props.timeBetweentitleAndSubTitle) {
            setTimeout((): void => {
                animateText(titlePlate, title, props.subTitlePlateDelay);
            }, props.timeBetweentitleAndSubTitle);
            return;
        }
        animateText(titlePlate, title, props.subTitlePlateDelay);
    }, 250);

    try {
        return (
            <div className={styles.titleDiv} id="homePageMainDivHeader">
                <h1 className={`${styles.namePlate} ${Work_Sans500.className}`} id="Name" ref={namePlate}></h1>
                <h2 className={`${styles.subNamePlate} ${Work_Sans300.className}`} id="PersonTitle" ref={titlePlate}></h2>
            </div>
        )
    } catch (err: unknown) {
        console.error(err as string);
        return (
            <></>
        )
    }
};

export default TitleDiv;
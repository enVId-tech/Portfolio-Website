import React from 'react';
import styles from '@/styles/titleDiv.module.scss';
import { Work_Sans, Montserrat } from 'next/font/google';
import animateText from '@/templates//other/scrollEffect.ts';

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
    titlePlate: string;
    subTitlePlate: string;
    titlePlateDelay: number;
    subTitlePlateDelay: number;
    timeBetweentitleAndSubTitle?: number;
    waitTime?: number;
}

const TitleDiv: React.FC<TitleDivProps> = (props: TitleDivProps): React.JSX.Element => {
    const namePlate = React.useRef<HTMLHeadingElement | null>(null);
    const titlePlate = React.useRef<HTMLHeadingElement | null>(null);

    const name: string = props.titlePlate.toString();
    const title: string = props.subTitlePlate.toString();



    setTimeout((): void => {
        animateText(namePlate, name, props.titlePlateDelay);
        if (props.timeBetweentitleAndSubTitle) {
            setTimeout((): void => {
                animateText(titlePlate, title, props.subTitlePlateDelay);
            }, props.timeBetweentitleAndSubTitle);
            return;
        }
        animateText(titlePlate, title, props.subTitlePlateDelay);
    }, props.waitTime as number ? props.waitTime as number : 150);

    try {
        return (
            <div className={styles.titleDiv} id="homePageMainDivHeader">
                <p className={`${styles.namePlate} ${Montserrat400.className}`} id="Name" ref={namePlate}></p>
                <p className={`${styles.subNamePlate} ${Work_Sans300.className}`} id="PersonTitle" ref={titlePlate}></p>
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
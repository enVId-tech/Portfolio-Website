/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from '@/styles/titleDiv.module.scss';
import { Work_Sans, Montserrat } from 'next/font/google';
import animateText from '@/modules/scrollEffect';
import { TitleDivProps } from '@/modules/exportInterfaces';
import { exportLogos } from '@/modules/exportConsts';

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

const TitleDiv: React.FC<TitleDivProps> = (props: TitleDivProps): React.JSX.Element => {
    const namePlate = React.useRef<HTMLHeadingElement | null>(null);
    const titlePlate = React.useRef<HTMLHeadingElement | null>(null);

    const name: string = props.titlePlate.toString();
    const title: string = props.subTitlePlate.toString();

    window.onload = (): void => {
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
    };


    try {
        return (
            <div className={styles.titleDiv} id="homePageMainDivHeader">
                <p className={`${styles.namePlate} ${Montserrat400.className}`} id="Name" ref={namePlate}></p>
                <p className={`${styles.subNamePlate} ${Work_Sans300.className}`} id="PersonTitle" ref={titlePlate}></p>
                <div className={styles.divider}>
                    <img src={exportLogos.enVId.src} alt="Web developer" width={350} height={350} className={styles.image} />
                </div>
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
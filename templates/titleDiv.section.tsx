import React from 'react';
import styles from '../styles/titleDiv.module.scss';
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
    waitTime?: number;
}

const TitleDiv: React.FC<TitleDivProps> = (props: TitleDivProps): JSX.Element => {
    const namePlate = React.useRef<HTMLHeadingElement | null>(null);
    const titlePlate = React.useRef<HTMLHeadingElement | null>(null);

    const name: string = props.titlePlate.toString();
    const title: string = props.subTitlePlate.toString();

    const animateText = (target: React.MutableRefObject<HTMLElement | null>, text: string, delay: number): void => {
        if (target.current === null) {
            throw new Error("Target not found" as string);
        }
        
        target.current.innerHTML = "";
        let i: number = 0;
        const intervalId: NodeJS.Timeout = setInterval((): void => {
            if (target.current !== null) {
                const currentText: string = target.current.innerHTML;
                if (currentText.includes(text) || currentText.length >= text.length + 2) {
                    target.current.innerHTML = "";
                }

                target.current.innerHTML += text.charAt(i);
                i++;
                target.current.innerHTML = target.current.innerHTML.replace("|", "");
                target.current.innerHTML += "|";

                if (i === text.length) {
                    clearInterval(intervalId);
                    setTimeout((): void => {
                        target.current!.innerHTML = target.current!.innerHTML.replace("|", "");
                    }, 250);
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
    }, props.waitTime ? props.waitTime : 150);

    try {
        return (
            <div className={styles.titleDiv} id="homePageMainDivHeader">
                <p className={`${styles.namePlate} ${Work_Sans500.className}`} id="Name" ref={namePlate}></p>
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
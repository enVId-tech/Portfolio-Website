import React, { EffectCallback } from 'react';
import styles from './scss/mypath.module.scss';
import { Work_Sans } from 'next/font/google';
import Box from './animations/flowchart/box.module.tsx';
import Line from './animations/flowchart/line.module.tsx';
import BoxTemplate from './animations/flowchart/box.template.tsx';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans_400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

interface MyPathProps {
    myPathScrollHeight: number;
}

const MyPath: React.FC<MyPathProps> = (props: MyPathProps): JSX.Element => {
    const [myPathScrolled, setMyPathScrolled] = React.useState<boolean>(false);

    const boxTemplate1Text: string[] = [
        "Journey starts here - May, 2020",
        "Started learning basic HTML - May, 2020",
        "Started learning JS - June, 2020",
        "Started learning CSS - June, 2020"
    ]

    React.useEffect(() => {
        const onScroll = (): void => {
            const scrollY: number = window.scrollY;
            console.log("scrollY: ", scrollY);

            if (scrollY >= props.myPathScrollHeight) {
                setMyPathScrolled(true);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [props.myPathScrollHeight]);

    return (
        <div className={`${styles.myPathDiv}`}>
            <p className={`${styles.myPathTitle} ${Work_Sans_300.className}`}>My Path</p>
            <span className={`${styles.masterSpan}`}>
            <div className={`${styles.transitionalDivLeft}`} />
                <div className={`${styles.myPathMain} ${myPathScrolled ? styles.contentAnimLeft : ""}`}>
                    <span className={`${styles.myPathTitleSpan}`}>
                        <BoxTemplate textInBoxes={boxTemplate1Text} numBoxes={4} delay={0} myPathScrolled={myPathScrolled} boxType={1} />
                    </span>
                    <br />
                    <span className={`${styles.myPathTitleSpan2}`}>
                        <BoxTemplate textInBoxes={boxTemplate1Text} numBoxes={4} delay={8} myPathScrolled={myPathScrolled} boxType={2} />
                    </span>
                    <br />
                    <span className={`${styles.myPathTitleSpan}`}>
                        <BoxTemplate textInBoxes={boxTemplate1Text} numBoxes={4} delay={16} myPathScrolled={myPathScrolled} boxType={3} />
                    </span>
                </div>
                <div className={`${styles.transitionalDivRight}`} />
            </span>
        </div>
    )
};

export default MyPath;
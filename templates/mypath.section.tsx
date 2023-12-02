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
                        <Box delay={9} myPathScrolled={myPathScrolled} text="Journey starts here - May, 2020" boxType={2} />
                        <Line delay={10} myPathScrolled={myPathScrolled} />
                        <Box delay={11} myPathScrolled={myPathScrolled} text="Started learning basic HTML - May, 2020" boxType={2} />
                        <Line delay={12} myPathScrolled={myPathScrolled} />
                        <Box delay={13} myPathScrolled={myPathScrolled} text="Started learning JS - June, 2020" boxType={2} />
                        <Line delay={14} myPathScrolled={myPathScrolled} />
                        <Box delay={15} myPathScrolled={myPathScrolled} text="Started learning CSS - June, 2020" boxType={2} />
                    </span>
                    <br />
                    <span className={`${styles.myPathTitleSpan}`}>
                        <Box delay={17} myPathScrolled={myPathScrolled} text="Journey starts here - May, 2020" boxType={1} />
                        <Line delay={18} myPathScrolled={myPathScrolled} />
                        <Box delay={19} myPathScrolled={myPathScrolled} text="Started learning basic HTML - May, 2020" boxType={1} />
                        <Line delay={20} myPathScrolled={myPathScrolled} />
                        <Box delay={21} myPathScrolled={myPathScrolled} text="Started learning JS - June, 2020" boxType={1} />
                        <Line delay={22} myPathScrolled={myPathScrolled} />
                        <Box delay={23} myPathScrolled={myPathScrolled} text="Started learning CSS - June, 2020" boxType={1} />
                    </span>
                </div>
                <div className={`${styles.transitionalDivRight}`} />
            </span>
        </div>
    )
};

export default MyPath;
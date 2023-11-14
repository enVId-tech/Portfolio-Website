import React from 'react';
import styles from './scss/mypath.module.scss';
import { Work_Sans } from 'next/font/google';
import Box from './animations/flowchart/box.module.tsx';
import Line from './animations/flowchart/line.module.tsx';

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

    const onScroll = React.useCallback((): void => {
        const scrollY = window;
        console.log("scrollY: ", scrollY.scrollY);

        if (scrollY.scrollY >= props.myPathScrollHeight) {
            setMyPathScrolled(true);
        }
    }, [props.myPathScrollHeight]);

    React.useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    return (
        <div className={`${styles.myPathDiv}`}>
            <p className={`${styles.myPathTitle} ${Work_Sans_300.className}`}>My Path</p>
            <div className={`${styles.myPathMain} ${myPathScrolled ? styles.contentAnimLeft : ""}`}>
                <span className={`${styles.myPathTitleSpan1}`}>
                    <Box delay={1} myPathScrolled={myPathScrolled} text="Journey starts here - May, 2020" />
                    <Line delay={2} myPathScrolled={myPathScrolled} />
                    <Box delay={3} myPathScrolled={myPathScrolled} text="Started learning basic HTML - May, 2020" />
                    <Line delay={4} myPathScrolled={myPathScrolled} />
                    <Box delay={5} myPathScrolled={myPathScrolled} text="Started learning JS - June, 2020"/>
                    <Line delay={6} myPathScrolled={myPathScrolled} />
                    <Box delay={7} myPathScrolled={myPathScrolled} text="Started learning CSS - June, 2020"/>
                </span>
            </div>
        </div>
    )
};

export default MyPath;
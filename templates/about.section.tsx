import React from 'react';
import Image from 'next/image';
import styles from './scss/about.module.scss';
import { Work_Sans } from 'next/font/google';

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

interface AboutProps {
    aboutScrollHeight: number;
}

const About: React.FC<AboutProps> = (props: AboutProps): JSX.Element => {
    const [aboutScrolled, setAboutScrolled] = React.useState<boolean>(false);

    const onScroll = React.useCallback((): void => {
        const scrollY = window;
        console.log("scrollY: ", scrollY.scrollY);

        if (scrollY.scrollY >= props.aboutScrollHeight) {
            setAboutScrolled(true);
        }
    }, [props.aboutScrollHeight]);

    React.useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    return (
        <div className={`${styles.aboutDiv}`} id="about">
            <div className={`${styles.smallerAboutDiv} ${aboutScrolled ? styles.contentAnimRight : ""}`}>
                <p className={`${styles.sectionHeading} ${Work_Sans_400.className}`}>About Me</p>
                <p className={`${styles.sectionSubHeading} ${Work_Sans_300.className}`}>High school student</p>
                <p className={`${styles.sectionParagraph1} ${Work_Sans_300.className}`}>Specialized in full stack web development.</p>
                <p className={`${styles.sectionParagraph2} ${Work_Sans_300.className}`}>Self-studied in software, 3 years</p>
            </div>
            <Image className={`${styles.aboutImage} ${aboutScrolled ? styles.contentAnimUp : ""}`} src="/images/personalPFP.png" alt="Web developer" width={350} height={350} />
        </div>
    )
};

export default About;
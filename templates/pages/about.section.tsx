import React from 'react';
import Image from 'next/image';
import styles from '@/styles/about.module.scss';
import { Work_Sans, Montserrat } from 'next/font/google';
import { exportLogos } from '@/templates/ts/exportConsts.ts';

const Montserrat_300 = Montserrat({
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
    aboutText: string[];
}

const About: React.FC<AboutProps> = (props: AboutProps): JSX.Element => {
    const [aboutScrolled, setAboutScrolled] = React.useState<boolean>(false);

    const onScroll = React.useCallback((): void => {
        const scrollY = window;

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
                <div className={styles.divider}>
                    {
                        props.aboutText.map((text: string, index: number): JSX.Element => {
                            return (
                                <p className={`${styles.sectionParagraph} ${Montserrat_300.className}`} key={index}>{text}</p>
                            )
                        })
                    }
                </div>
            </div>
            <Image className={`${styles.aboutImage} ${aboutScrolled ? styles.contentAnimUp : ""}`} src={exportLogos.enVId.src} alt="Web developer" width={350} height={350} />
        </div>
    )
};

export default About;
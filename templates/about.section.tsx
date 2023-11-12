import React from 'react';
import styles from './scss/about.module.scss';
import { Work_Sans } from 'next/font/google';
import applyPageAnims from './animations/animations.anim.ts';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans_500 = Work_Sans({
    weight: "500",
    style: 'normal',
    subsets: ['latin']
});

const About: React.FC = (): JSX.Element => {
    const mainAbout = React.useRef<HTMLDivElement | null>(null);

    const refs: React.RefObject<HTMLDivElement>[] = [
        mainAbout
    ];

    const anims: string[] = [
        "c_right"
    ]

    const handleAnims = (): void => {
        applyPageAnims(styles, refs, anims, 1.1);
    }

    React.useEffect((): void => {
        handleAnims();

        window.addEventListener('scroll', handleAnims);

        return () => {
            window.removeEventListener('scroll', handleAnims);
        }
    }, []);



    return (
        <div className={`${styles.aboutDiv}`} ref={mainAbout}>
            
            <div className={`${styles.smallerAboutDiv}`}>
                <p className={`${styles.sectionHeading} ${Work_Sans_500.className}`}>About Me</p>
            </div>
        </div>
    )
};

export default About;
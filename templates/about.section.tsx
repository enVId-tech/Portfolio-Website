import React from 'react';
import styles from './scss/about.module.scss';
import { Work_Sans } from 'next/font/google';

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
    return (
        <div className={`${styles.aboutDiv}`}>
            <div className={`${styles.smallerAboutDiv}`}>
                <p className={`${styles.sectionHeading} ${Work_Sans_500.className}`}>About Me</p>
            </div>
        </div>
    )
};

export default About;
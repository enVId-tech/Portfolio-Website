import React from 'react';
import styles from '@/styles/about.module.scss';
import {M_400, M_600} from "@/utils/globalFonts";

type AboutProps = {
    children?: React.ReactNode;
}

/**
 * About component that displays information about skills, experience, and interests.
 * @returns {React.ReactElement} The rendered About component.
 */
export default function About({ children }: AboutProps): React.ReactElement {
    return (
        <div className={styles.container}>
            <h2 className={`${styles.aboutTitle} ${M_600}`}>About Me</h2>

            <div className={styles.cardGrid}>
                <div className={`${styles.card} ${styles.skillsCard}`}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Skills</h3>
                    <ul className={`${styles.skillsList} ${M_400}`}>
                        <li>Frontend: React, Next.js, TypeScript</li>
                        <li>Backend: Node.js, Express</li>
                        <li>Databases: MongoDB, SQL</li>
                        <li>Other: Git, Docker</li>
                    </ul>
                </div>

                <div className={styles.card}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Experience</h3>
                    <div className={`${styles.experienceText} ${M_400}`}>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>4y</span> full-stack development
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>3y</span> React.js
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>2y</span> Next.js
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Interests</h3>
                    <p className={`${M_400} ${styles.compactText}`}>
                        Exploring new technologies and building efficient, scalable web applications.
                    </p>
                </div>
            </div>
            { children }
        </div>
    );
}
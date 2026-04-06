import React from 'react';
import styles from '@/styles/about.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { years } from '@/utils/dates';

type AboutProps = {
    children?: React.ReactNode;
}

/**
 * About component that displays information about skills, experience, and interests.
 * @returns {React.ReactElement} The rendered About component.
 */
export default function About({ children }: AboutProps): React.ReactElement {
    return (
        <section className={styles.container} id={"about"} aria-label="About Erick Tran">
            <h2 className={`${styles.aboutTitle} ${M_600}`}>About Me</h2>

            <div className={styles.cardGrid}>
                <div className={`${styles.card} ${styles.skillsCard}`}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Statistics</h3>
                    <div className={`${styles.experienceText} ${M_400}`}>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>6</span> certifications
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>20+</span> projects completed
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>5</span> degree programs attending
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Experience</h3>
                    <div className={`${styles.experienceText} ${M_400}`}>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>{years.dev}y</span> web development
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>{years.fullStack}y</span> full-stack development
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>{years.react}y</span> React.js
                        </div>
                        <div className={styles.experienceItem}>
                            <span className={styles.highlight}>{years.next}y</span> Next.js
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Interests</h3>
                    <ul className={`${styles.skillsList} ${M_400}`}>
                        <li>Computer Science</li>
                        <li>Computer Engineering and Design</li>
                        <li>IT and Networking</li>
                        <li>Software Development</li>
                    </ul>
                </div>
            </div>
            {children}
        </section>
    );
}
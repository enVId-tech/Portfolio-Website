import React from 'react';
import styles from '@/styles/about.module.scss';
import {M_400, M_600} from "@/utils/globalFonts";

export default function About(): React.ReactElement {
    return (
        <div className={styles.container}>
            <section className={styles.about}>
                <h2 className={`${styles.aboutTitle} ${M_600}`}>About Me</h2>

                <div className={styles.aboutContent}>
                    <div className={styles.card}>
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
                        <div className={`${M_400}`}>
                            <span className={styles.highlight}>4 years</span> of full-stack development
                            <br/>
                            <span className={styles.highlight}>3 years</span> with ReactJS
                            <br/>
                            <span className={styles.highlight}>2 years</span> with NextJS
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={`${styles.cardTitle} ${M_600}`}>Interests</h3>
                    <p className={`${M_400}`}>
                        Always exploring new technologies and building solutions. Passionate about creating efficient, scalable web applications and learning emerging development tools.
                    </p>
                </div>
            </section>
        </div>
    );
}
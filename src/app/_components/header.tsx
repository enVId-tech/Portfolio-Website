"use client";
import React from "react";
import styles from "@/styles/header.module.scss";
import {M_400, M_600} from "@/utils/globalFonts";


type HeaderProps = {
    children?: React.ReactNode;
}

/**
 * Header component that displays the name, title, and description.
 * @returns {React.ReactElement} The rendered header component.
 */
export default function Header({ children }: HeaderProps): React.ReactElement {
    return (
        <div className={styles.container} id={"header"}>
            <header>
                <h1 className={`${styles.header} ${M_600}`}>
                    Hi, I&#39;m <span className={`${styles.name} ${M_600}`}>Erick</span>
                </h1>
                <h2 className={`${styles.headerName} ${M_600}`}>
                    Fullstack developer.
                </h2>
                <div className={`${styles.headerButtons}`}>
                    <button className={`${M_400}`} onClick={() => window.open('https://github.com/enVId-tech', '_blank')}>
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </button>
                    <button className={`${M_400}`} onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=erick.tran@etran.dev", "_blank")}>
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                        </svg>
                        Email
                    </button>
                </div>
                <p className={`${styles.description} ${M_400}`}>
                    Hi, I am Erick. I have 4 years of experience in full-stack website development, including 3 in ReactJS and 2 in NextJS, and I specialize in Node.js. Always learning new things all the time, and ready to make solutions.
                </p>
            </header>
            { children }
        </div>
    );
}
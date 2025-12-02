"use client";
import React from "react";
import styles from "@/styles/header.module.scss";
import {M_400, M_600} from "@/utils/globalFonts";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";


type HeaderProps = {
    children?: React.ReactNode;
}

/**
 * Header component that displays the name, title, and description.
 * @returns {React.ReactElement} The rendered header component.
 */
export default function Header({ children }: HeaderProps): React.ReactElement {
    return (
        <section className={styles.container} id={"header"} aria-label="Hero section">
            <header>
                <h1 className={`${styles.header} ${M_600}`}>
                    Hi, I&#39;m <span className={`${styles.name} ${M_600}`}>Erick</span>
                </h1>
                <h2 className={`${styles.headerName} ${M_600}`}>
                    Full-stack developer.
                </h2>
                <nav className={`${styles.headerButtons}`} aria-label="Social media links">
                    <a 
                        href="https://github.com/enVId-tech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`${M_400}`}
                        aria-label="Visit Erick Tran's GitHub profile"
                    >
                        <FaGithub size={20} aria-hidden="true" />
                        GitHub
                    </a>
                    <a 
                        href="https://www.linkedin.com/in/ericktran-cs/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`${M_400}`}
                        aria-label="Visit Erick Tran's LinkedIn profile"
                    >
                        <FaLinkedin size={20} aria-hidden="true" />
                        LinkedIn
                    </a>
                    <a 
                        href="mailto:erick.tran@etran.dev" 
                        className={`${M_400}`}
                        aria-label="Send email to Erick Tran"
                    >
                        <AiOutlineMail size={20} aria-hidden="true" />
                        Email
                    </a>
                </nav>
                <p className={`${styles.description} ${M_400}`}>
                    Hi, I am Erick. I have 3 years of experience in full-stack website development, including 3 using ReactJS, 3 using Node.js with Express, and 2 using Next.js. Always learning new things all the time, and ready to make solutions.
                </p>
            </header>
            { children }
        </section>
    );
}
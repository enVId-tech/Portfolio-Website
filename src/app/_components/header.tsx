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
                        <FaGithub size={20} />
                        GitHub
                    </button>
                    <button className={`${M_400}`} onClick={() => window.open("https://www.linkedin.com/in/ericktran-cs/", "_blank")}>
                        <FaLinkedin size={20} />
                        LinkedIn
                    </button>
                    <button className={`${M_400}`} onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=erick.tran@etran.dev", "_blank")}>
                        <AiOutlineMail size={20} />
                        Email
                    </button>
                </div>
                <p className={`${styles.description} ${M_400}`}>
                    Hi, I am Erick. I have 3 years of experience in full-stack website development, including 3 using ReactJS, 3 using Node.js with Express, and 2 using Next JS. Always learning new things all the time, and ready to make solutions.
                </p>
            </header>
            { children }
        </div>
    );
}
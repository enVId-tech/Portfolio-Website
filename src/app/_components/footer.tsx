"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/footer.module.scss';
import { M_400 } from "@/utils/globalFonts";
import { FaGithub, FaEnvelope, FaArrowUp } from 'react-icons/fa';

type FooterProps = {
    children?: React.ReactNode;
}

/**
 * Footer component that displays social links, copyright information, and a scroll-to-top button.
 * @returns {React.ReactElement} The rendered footer component.
 */
export default function Footer({ children }: FooterProps): React.ReactElement {
    // State to manage the visibility of the footer animation
    const [isVisible, setIsVisible] = useState(false);
    // Get the current year
    const year: number = new Date().getFullYear();

    /**
     * Scrolls the window to the top smoothly.
     */
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Set the footer to visible when the component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <footer className={`${styles.footer} section-animate footer-section ${isVisible ? 'visible' : ''}`}>
            <div className={styles.container}>
                <div className={styles.socialLinks}>
                    <a href="https://github.com/enVId-tech" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <FaGithub className={styles.icon} />
                    </a>
                    {/*<a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">*/}
                    {/*    <FaLinkedin className={styles.icon} />*/}
                    {/*</a>*/}
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=erick.tran@etran.dev" target="_blank" aria-label="Email">
                        <FaEnvelope className={styles.icon} />
                    </a>
                </div>

                <div className={`${styles.copyright} ${M_400}`}>
                    © {year} Erick Tran. All rights reserved.
                </div>

                <button className={styles.scrollTopButton} onClick={scrollToTop} aria-label="Scroll to top">
                    <FaArrowUp />
                </button>
            </div>
            { children }
        </footer>
    );
}
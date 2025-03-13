"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '@/styles/scrolltotop.module.scss';

export default function ScrollToTop(): React.ReactElement {
    const [buttonState, setButtonState] = useState<'hidden' | 'visible' | 'fading'>('hidden');

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            if (buttonState === 'hidden' || buttonState === 'fading') {
                setButtonState('visible');
            }
        } else if (buttonState === 'visible') {
            setButtonState('fading');
            setTimeout(() => {
                setButtonState('hidden');
            }, 400);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // Initial check
        toggleVisibility();

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [buttonState]);

    return (
        <button
            className={`${styles.scrollButton} ${
                buttonState === 'visible' ? styles.visible :
                    buttonState === 'fading' ? styles.fading : ''
            }`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <FaArrowUp />
        </button>
    );
}
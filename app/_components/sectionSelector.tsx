'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/sectionSelector.module.scss';
import { FaHome, FaUser, FaHistory, FaLaptopCode, FaCogs } from 'react-icons/fa';
import { RiArticleLine } from 'react-icons/ri';
import {M_600} from "@/utils/globalFonts";

interface SectionSelectorProps {
    sections: {
        id: string;
        label: string;
    }[];
}

export default function SectionSelector({ sections }: SectionSelectorProps): React.ReactElement {
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
    const selectorRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    // Define icons for each section
    const sectionIcons: {[key: string]: React.ReactNode} = {
        header: <FaHome />,
        about: <FaUser />,
        timeline: <FaHistory />,
        projects: <FaLaptopCode />,
        blogs: <RiArticleLine />,
        technology: <FaCogs />,
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section && section.offsetTop <= scrollPosition) {
                    if (activeSection !== sections[i].id) {
                        setActiveSection(sections[i].id);
                    }
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections, activeSection]);

    useEffect(() => {
        if (!indicatorRef.current || !selectorRef.current) return;

        const activeIndex = sections.findIndex(section => section.id === activeSection);
        if (activeIndex === -1) return;

        const dotElements = selectorRef.current.querySelectorAll(`.${styles.dot}`);
        if (!dotElements[activeIndex]) return;

        const dotPos = dotElements[activeIndex].getBoundingClientRect();
        const selectorPos = selectorRef.current.getBoundingClientRect();

        indicatorRef.current.style.transform = `translateY(${dotPos.top - selectorPos.top}px)`;
    }, [activeSection, sections]);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.sectionSelector} ref={selectorRef}>
            <div className={styles.selectorIndicator} ref={indicatorRef}></div>
            {sections.map((section) => (
                <button
                    key={section.id}
                    className={`${styles.dot} ${activeSection === section.id ? styles.active : ''}`}
                    onClick={() => scrollToSection(section.id)}
                    aria-label={`Go to ${section.label} section`}
                    title={section.label}
                >
                    <div className={styles.iconWrapper}>
                        {sectionIcons[section.id]}
                    </div>
                    <span className={`${styles.label} ${M_600}`}>{section.label}</span>
                </button>
            ))}
        </div>
    );
}
"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/technology.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";

// Import tech icons
import { FaReact, FaGitAlt, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs } from 'react-icons/si';

/**
 * Interface representing a technology.
 */
interface Tech {
    name: string;
    icon: React.ReactNode;
    proficiency: number;
    proficiencyLabel: string;
    usage: number;
}

/**
 * Props for the Technology component.
 */
type TechnologyProps = {
    children?: React.ReactNode;
}

/**
 * Technology component to display a list of technologies with their proficiency and usage.
 * @param {TechnologyProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Technology component.
 */
export default function Technology({ children }: TechnologyProps): React.ReactElement {
    const [visibleTechs, setVisibleTechs] = useState<{ [key: string]: boolean }>({});
    const techRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const technologies: Tech[] = [
        // Coding technologies
        {
            name: "React",
            icon: <FaReact size={48} color="#61DAFB" />,
            proficiency: 5,
            proficiencyLabel: "Expert",
            usage: 85
        },
        {
            name: "TypeScript",
            icon: <SiTypescript size={42} color="#3178C6" />,
            proficiency: 5,
            proficiencyLabel: "Expert",
            usage: 90
        },
        {
            name: "Next.js",
            icon: <SiNextdotjs size={42} color="#ffffff" />,
            proficiency: 4,
            proficiencyLabel: "Advanced",
            usage: 70
        },
        {
            name: "Git",
            icon: <FaGitAlt size={48} color="#F05032" />,
            proficiency: 5,
            proficiencyLabel: "Expert",
            usage: 95
        },
        {
            name: "Docker",
            icon: <FaDocker size={48} color="#2496ED" />,
            proficiency: 3,
            proficiencyLabel: "Intermediate",
            usage: 50
        }
    ];

    /**
     * Effect to observe the visibility of technology elements and update state accordingly.
     */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const tech = entry.target.getAttribute('data-tech');
                        if (tech) {
                            setVisibleTechs(prev => ({ ...prev, [tech]: true }));
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        technologies.forEach(tech => {
            if (techRefs.current[tech.name]) {
                observer.observe(techRefs.current[tech.name]!);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={`${styles.techTitle} ${M_600}`}>Technology Stack</h2>

            <div className={styles.techGrid}>
                {technologies.map(tech => (
                    <div key={tech.name}
                         ref={el => { techRefs.current[tech.name] = el; }}
                         data-tech={tech.name}
                         className={`${styles.techCard} ${visibleTechs[tech.name] ? styles.visible : ''}`}>
                        <div className={styles.logoContainer}>
                            {tech.icon}
                        </div>
                        <h3 className={`${styles.techName} ${M_600}`}>{tech.name}</h3>

                        <div className={styles.proficiencyContainer}>
                            <span className={`${styles.proficiencyLabel} ${M_400}`}>{tech.proficiencyLabel}</span>
                            <div className={styles.proficiencyBar}>
                                <div className={styles.proficiencyFill} style={{width: `${tech.proficiency * 20}%`}}/>
                            </div>
                        </div>

                        <div className={styles.usageContainer}>
                            <span className={`${styles.usageLabel} ${M_400}`}>Usage</span>
                            <div className={styles.usageBar}>
                                <div className={styles.usageFill} style={{width: `${tech.usage}%`}}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            { children }
        </div>
    );
}
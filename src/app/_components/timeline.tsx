"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/timeline.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export default function Timeline(): React.ReactElement {
    const [activeIndex, setActiveIndex] = useState(0);
    const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);
    const activeDotRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);

    const events: TimelineEvent[] = [
        {
            year: "2020",
            title: "Started Programming Journey",
            description: "Began learning web development fundamentals with HTML, CSS, and JavaScript."
        },
        {
            year: "2021",
            title: "First React Project",
            description: "Built my first React application and deployed it to production."
        },
        {
            year: "2022",
            title: "Learned Next.js",
            description: "Expanded my skills with server-side rendering and static site generation."
        },
        {
            year: "2023",
            title: "Mastered TypeScript",
            description: "Adopted TypeScript in all my projects for better code quality and developer experience."
        },
        {
            year: "2024",
            title: "Full Stack Development",
            description: "Working with modern full-stack applications using Next.js, React, and various backend technologies."
        }
    ];

    useEffect(() => {
        // Initialize refs array
        eventRefs.current = Array(events.length).fill(null);

        let ticking = false;

        const updateActiveDotPosition = (index: number) => {
            const activeRef = eventRefs.current[index];
            const timelineElement = timelineRef.current;

            if (activeRef && activeDotRef.current && timelineElement) {
                // Get positions relative to the viewport
                const timelineRect = timelineElement.getBoundingClientRect();
                const eventRect = activeRef.getBoundingClientRect();

                // Calculate position relative to timeline container
                const relativeTop = eventRect.top - timelineRect.top + 25; // 25px for alignment

                // Apply the transform with both Y and X translations
                activeDotRef.current.style.transform = `translateY(${relativeTop}px) translateX(-50%)`;

                if (progressLineRef.current) {
                    progressLineRef.current.style.height = `${relativeTop}px`;
                }
            }
        };

        const determineActiveEvent = () => {
            // Calculate viewport middle point
            const viewportMiddle = window.scrollY + window.innerHeight / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            eventRefs.current.forEach((ref, index) => {
                if (!ref) return;

                const rect = ref.getBoundingClientRect();
                const elementCenter = window.scrollY + rect.top + rect.height / 2;
                const distance = Math.abs(elementCenter - viewportMiddle);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
            updateActiveDotPosition(closestIndex);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                // Use requestAnimationFrame for better performance
                window.requestAnimationFrame(() => {
                    determineActiveEvent();
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        // Initial position after DOM is ready
        setTimeout(handleScroll, 500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [events.length]); // Only depend on events length

    return (
        <div className={styles.container}>
            <h2 className={`${styles.timelineTitle} ${M_600}`}>My Journey</h2>

            <div className={styles.timeline} ref={timelineRef}>
                <div className={styles.timelineLine}>
                    <div className={styles.progressLine} ref={progressLineRef} />
                    <div ref={activeDotRef} className={styles.activeDot}></div>
                </div>

                {events.map((event, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            eventRefs.current[index] = el;
                        }}
                        className={`${styles.timelineEvent} ${index % 2 === 0 ? styles.left : styles.right} ${index === activeIndex ? styles.active : ''}`}
                    >
                        <div className={styles.eventContent}>
                            <div className={`${styles.eventYear} ${M_600}`}>{event.year}</div>
                            <div className={styles.eventCard}>
                                <h3 className={`${styles.eventTitle} ${M_600}`}>{event.title}</h3>
                                <p className={`${styles.eventDescription} ${M_400}`}>{event.description}</p>
                            </div>
                        </div>
                        <div className={styles.eventDot}/>
                    </div>
                ))}
            </div>
        </div>
    );
}
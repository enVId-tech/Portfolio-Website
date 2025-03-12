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
        // Initialize refs array with nulls to ensure indexes exist
        eventRefs.current = Array(events.length).fill(null);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Find the index of this element in our refs array
                        const index = eventRefs.current.findIndex(ref => ref === entry.target);
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                threshold: 0.6,
                rootMargin: '-10% 0px -30% 0px' // Adjust when elements become active
            }
        );

        eventRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            eventRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [events.length]);

    return (
        <div className={styles.container}>
            <h2 className={`${styles.timelineTitle} ${M_600}`}>My Journey</h2>

            <div className={styles.timeline} ref={timelineRef}>
                <div className={styles.timelineLine}>
                    <div
                        className={styles.progressLine}
                        style={{
                            height: activeIndex >= 0 && eventRefs.current[activeIndex]
                                ? `${eventRefs.current[activeIndex].offsetTop + 25}px`
                                : '0'
                        }}
                    />
                </div>

                {events.map((event, index) => (
                    <div
                        key={index}
                        ref={(el) => { eventRefs.current[index] = el; }}
                        className={`${styles.timelineEvent} ${index % 2 === 0 ? styles.left : styles.right} ${index === activeIndex ? styles.active : ''}`}
                    >
                        <div className={styles.eventDot} />
                        <div className={styles.eventContent}>
                            <div className={styles.eventYear}>{event.year}</div>
                            <div className={styles.eventCard}>
                                <h3 className={`${styles.eventTitle} ${M_600}`}>{event.title}</h3>
                                <p className={`${styles.eventDescription} ${M_400}`}>{event.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
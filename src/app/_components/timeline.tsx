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

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current || !activeDotRef.current) return;

            // Get timeline and viewport positions
            const timelineRect = timelineRef.current.getBoundingClientRect();

            // Check each event element's position
            let activeEventIndex = 0;

            eventRefs.current.forEach((ref, index) => {
                if (!ref) return;

                const eventRect = ref.getBoundingClientRect();
                // Check if this event is centered in viewport
                if (eventRect.top <= window.innerHeight/2 && eventRect.bottom >= window.innerHeight/2) {
                    activeEventIndex = index;
                }
            });

            // Set active index
            setActiveIndex(activeEventIndex);

            // Position active dot at the current active event
            const activeRef = eventRefs.current[activeEventIndex];
            if (activeRef && activeDotRef.current) {
                const dotPosition = activeRef.offsetTop + 25; // 25px is to align with event dot
                activeDotRef.current.style.transform = `translateY(${dotPosition}px) translateX(-50%)`;
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Initial position calculation
        // Use a timeout to ensure DOM is fully rendered
        const initialTimer = setTimeout(handleScroll, 200);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(initialTimer);
        };
    }, []); // Empty dependency array to avoid recreating the effect

    return (
        <div className={styles.container}>
            <h2 className={`${styles.timelineTitle} ${M_600}`}>My Journey</h2>

            <div className={styles.timeline} ref={timelineRef}>
                <div className={styles.timelineLine}>
                    <div
                        className={styles.progressLine}
                        style={{
                            height: activeIndex >= 0 && eventRefs.current[activeIndex]
                                ? `${eventRefs.current[activeIndex].offsetTop + 30}px` // Add a bit extra to cover below the dot
                                : '0'
                        }}
                    />
                    {/* Active moving dot */}
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
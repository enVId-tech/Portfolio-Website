"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/styles/timeline.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export default function Timeline(): React.ReactElement {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
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

    // Calculate and update dot position
    const updateDotPosition = useCallback((index: number) => {
        const eventElement = eventRefs.current[index];
        const timelineElement = timelineRef.current;
        const dotElement = activeDotRef.current;
        const progressElement = progressLineRef.current;

        if (!eventElement || !timelineElement || !dotElement || !progressElement) return;

        const timelineRect = timelineElement.getBoundingClientRect();
        const eventRect = eventElement.getBoundingClientRect();
        const relativeTop = eventRect.top - timelineRect.top + 15;

        // Set position directly
        dotElement.style.transform = `translateY(${relativeTop}px) translateX(-50%)`;
        progressElement.style.height = `${relativeTop}px`;
    }, []);

    // Find the event closest to viewport center
    const determineActiveEvent = useCallback(() => {
        const viewportMiddle = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        eventRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const rect = ref.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - viewportMiddle);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
        }
    }, [activeIndex]);

    // Initialize timeline
    useEffect(() => {
        // Show timeline after a brief delay for smoother mounting
        const visibilityTimer = setTimeout(() => setIsVisible(true), 100);

        // Initialize event refs array
        eventRefs.current = Array(events.length).fill(null);

        return () => clearTimeout(visibilityTimer);
    }, [events.length]);

    // Handle scroll and resize events
    useEffect(() => {
        let scrollRAF: number | null = null;

        const handleScroll = () => {
            if (scrollRAF !== null) return;

            scrollRAF = requestAnimationFrame(() => {
                determineActiveEvent();
                scrollRAF = null;
            });
        };

        const handleResize = () => {
            if (scrollRAF !== null) {
                cancelAnimationFrame(scrollRAF);
                scrollRAF = null;
            }
            determineActiveEvent();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Initial calculation
        const initialTimer = setTimeout(handleScroll, 300);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(initialTimer);
            if (scrollRAF !== null) cancelAnimationFrame(scrollRAF);
        };
    }, [determineActiveEvent]);

    // Update dot position when activeIndex changes
    useEffect(() => {
        if (!isVisible) return;

        // Reset transition on the activeDot element
        if (activeDotRef.current) {
            activeDotRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        }

        // Update position with a short delay to ensure elements are ready
        const timer = setTimeout(() => updateDotPosition(activeIndex), 50);
        return () => clearTimeout(timer);
    }, [activeIndex, isVisible, updateDotPosition]);

    // Handle visibility change (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Refresh position calculation when tab becomes visible
                const timer = setTimeout(() => updateDotPosition(activeIndex), 100);
                return () => clearTimeout(timer);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [activeIndex, updateDotPosition]);

    return (
        <div className={styles.container}>
            <h2 className={`${styles.timelineTitle} ${M_600}`}>My Journey</h2>

            <div
                className={`${styles.timeline} ${isVisible ? styles.visible : ''}`}
                ref={timelineRef}
            >
                <div className={styles.timelineLine}>
                    <div className={styles.progressLine} ref={progressLineRef} />
                    <div ref={activeDotRef} className={styles.activeDot}></div>
                </div>

                {events.map((event, index) => (
                    <div
                        key={index}
                        ref={(el) => { eventRefs.current[index] = el; }}
                        className={`${styles.timelineEvent} ${index % 2 === 0 ? styles.left : styles.right} ${index === activeIndex ? styles.active : ''}`}
                    >
                        <div className={styles.eventContent}>
                            <div className={`${styles.eventYear} ${M_600}`}>{event.year}</div>
                            <div className={styles.eventTextContent}>
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
"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/styles/timeline.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { cachedFetch } from '@/utils/cache';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

interface TimelineApiResponse {
    success: boolean;
    timelineItems: TimelineEvent[];
}

type TimelineProps = {
    children?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const TimelineEvent = React.memo(({
    event,
    isActive,
    isLeft,
    refCallback
}: {
    event: TimelineEvent,
    isActive: boolean,
    isLeft: boolean,
    refCallback: (el: HTMLDivElement | null) => void
}) => (
    <div
        ref={refCallback}
        className={`${styles.timelineEvent} ${isLeft ? styles.left : styles.right} ${isActive ? styles.active : ''}`}
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
));

function Timeline({ children }: TimelineProps): React.ReactElement {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);
    const activeDotRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const scrollThrottleRef = useRef<boolean>(false);
    const positionsRef = useRef<{top: number, height: number}[]>([]);
    const timelineRectRef = useRef<DOMRect | null>(null);
    
    const updateEvents = useCallback(async () => {
        try {
            const data = await cachedFetch(
                '/api/timeline',
                'api-timeline',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'public, max-age=1200'
                    }
                },
                20 * 60 * 1000 // 20 minutes cache - aggressive caching
            ) as TimelineApiResponse;

            console.log('Fetched timeline data:', data);

            if (data.success && Array.isArray(data.timelineItems)) {
                setEvents(data.timelineItems.map((event: TimelineEvent) => ({
                    year: event.year || "Unknown",
                    title: event.title || "Untitled",
                    description: event.description || "No description available."
                })));
            } else {
                console.error('Invalid timeline data format:', data);
                setEvents([
                    {
                        year: "Unknown",
                        title: "Error",
                        description: "Failed to load timeline events. Please try again later."
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching timeline events:', error);
            setEvents([
                {
                    year: "Unknown",
                    title: "Error",
                    description: "Failed to load timeline events. Please try again later."
                }
            ]);
        }
    }, []);
    // Fetch events on mount
    useEffect(() => {
        updateEvents();
    }, [updateEvents]);

    // Calculate element positions and cache them
    const updateElementPositions = useCallback(() => {
        if (!timelineRef.current) return;

        // Cache timeline position
        timelineRectRef.current = timelineRef.current.getBoundingClientRect();

        // Cache all event positions relative to timeline
        positionsRef.current = eventRefs.current.map(ref => {
            if (!ref || !timelineRectRef.current) return { top: 0, height: 0 };
            const rect = ref.getBoundingClientRect();
            return {
                top: rect.top - timelineRectRef.current.top,
                height: rect.height
            };
        });
    }, []);

    // Update dot position based on cached positions
    const updateDotPosition = useCallback((index: number) => {
        if (!activeDotRef.current || !progressLineRef.current || !positionsRef.current[index]) return;

        const position = positionsRef.current[index];
        const relativeTop = position.top + 15;

        activeDotRef.current.style.transform = `translateY(${relativeTop}px) translateX(-50%)`;
        progressLineRef.current.style.height = `${relativeTop}px`;
    }, []);

    // Determine active event using cached positions
    const determineActiveEvent = useCallback(() => {
        if (positionsRef.current.length === 0 || !timelineRectRef.current) return;

        const viewportMiddle = window.innerHeight / 2;
        const timelineTop = timelineRectRef.current.top;

        let closestIndex = 0;
        let minDistance = Infinity;

        positionsRef.current.forEach((position, index) => {
            const elementMiddle = timelineTop + position.top + position.height / 2;
            const distance = Math.abs(elementMiddle - viewportMiddle);

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
        const visibilityTimer = setTimeout(() => setIsVisible(true), 100);
        eventRefs.current = Array(events.length).fill(null);
        return () => clearTimeout(visibilityTimer);
    }, [events.length]);

    // Handle scroll with throttling
    useEffect(() => {
        const handleScroll = () => {
            if (scrollThrottleRef.current) return;

            scrollThrottleRef.current = true;

            requestAnimationFrame(() => {
                updateElementPositions();
                determineActiveEvent();
                scrollThrottleRef.current = false;
            });
        };

        const handleResize = () => {
            // Clear throttle on resize for immediate response
            scrollThrottleRef.current = false;

            // Recalculate everything on resize
            updateElementPositions();
            determineActiveEvent();
        };

        // Use passive event listeners for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Initial calculations
        const initialTimer = setTimeout(() => {
            updateElementPositions();
            determineActiveEvent();
        }, 300);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(initialTimer);
        };
    }, [updateElementPositions, determineActiveEvent]);

    // Update dot position when activeIndex changes
    useEffect(() => {
        if (!isVisible) return;

        if (activeDotRef.current) {
            activeDotRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        }

        updateDotPosition(activeIndex);
    }, [activeIndex, isVisible, updateDotPosition]);

    // Visibility change handler
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updateElementPositions();
                updateDotPosition(activeIndex);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [activeIndex, updateElementPositions, updateDotPosition]);

    // Create refs callback
    const createRefCallback = useCallback((index: number) => (el: HTMLDivElement | null) => {
        eventRefs.current[index] = el;
    }, []);

    return (
        <div className={styles.container} id={"timeline"}>
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
                    <TimelineEvent
                        key={index}
                        event={event}
                        isActive={index === activeIndex}
                        isLeft={index % 2 === 0}
                        refCallback={createRefCallback(index)}
                    />
                ))}
            </div>
            { children }
        </div>
    );
}

export default React.memo(Timeline);
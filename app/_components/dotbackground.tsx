'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/dotbackground.module.scss';

interface Dot {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    size: number;
    color: string;
    opacity: number;
    vx: number;
    vy: number;
}

interface ElementBoundingBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface DotBackgroundConfig {
    targetDotCount?: number; // Dots across width
    maxDistance?: number; // Mouse interaction distance
    dotSize?: number; // Size of dots
    dotOpacity?: number; // Opacity value
    dotColor?: string; // RGB color
    returnForce?: number; // Return to position speed
    friction?: number; // Movement dampening
    pushForce?: number; // Mouse repel strength
}

type DotBackgroundProps = {
    children?: React.ReactNode;
    config?: DotBackgroundConfig;
}

export default function DotBackground({
                                           children,
                                            config = {}
                                       }: DotBackgroundProps): React.ReactElement {
    // Component refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>(0);
    const [elementBoxes, setElementBoxes] = useState<ElementBoundingBox[]>([]);

    // Default configuration with overrides
    const effectiveConfig = {
        targetDotCount: 40,
        maxDistance: 100,
        dotSize: 1.5,
        dotOpacity: 0.7,
        dotColor: 'rgb(255, 255, 255)',
        returnForce: 0.2,
        friction: 0.4,
        pushForce: 2,
        ...config
    };
    // Function to check if a point is inside any element's bounding box
    const isInsideAnyElement = React.useCallback((x: number, y: number): boolean => {
        return elementBoxes.some(box =>
            x >= box.left &&
            x <= box.left + box.width &&
            y >= box.top &&
            y <= box.top + box.height
        );
    }, [elementBoxes]);

    // Calculate element positions
    useEffect(() => {
        const updateElementBoxes = () => {
            if (!contentRef.current || !canvasRef.current) return;

            const boxes: ElementBoundingBox[] = [];
            const canvasRect = canvasRef.current.getBoundingClientRect();

            // Get all direct child elements
            const childElements = contentRef.current.children;
            for (let i = 0; i < childElements.length; i++) {
                const element = childElements[i];
                const rect = element.getBoundingClientRect();

                boxes.push({
                    top: rect.top - canvasRect.top,
                    left: rect.left - canvasRect.left,
                    width: rect.width,
                    height: rect.height
                });
            }

            setElementBoxes(boxes);
        };

        updateElementBoxes();

        // Add resize observer to update boxes when elements resize
        const resizeObserver = new ResizeObserver(() => {
            updateElementBoxes();
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match window
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initDots(); // Reinitialize dots when resizing
        };

        // Create dots
        const initDots = () => {
            const dots: Dot[] = [];

            // Calculate appropriate spacing based on container dimensions
// Target number of dots across the width
            const spacing = Math.max(Math.floor(canvas.width / effectiveConfig.targetDotCount), 15);

            const cols = Math.floor(canvas.width / spacing);
            const rows = Math.floor(canvas.height / spacing);

            // Calculate offsets to center the grid
            const offsetX = (canvas.width - (cols * spacing)) / 2;
            const offsetY = (canvas.height - (rows * spacing)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing + spacing / 2 + offsetX;
                    const y = j * spacing + spacing / 2 + offsetY;

                    dots.push({
                        x,
                        y,
                        originalX: x,
                        originalY: y,
                        size: effectiveConfig.dotSize,
                        color: effectiveConfig.dotColor,
                        opacity: effectiveConfig.dotOpacity,
                        vx: 0,
                        vy: 0
                    });
                }
            }

            dotsRef.current = dots;
        };

        // Handle mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dotsRef.current.forEach(dot => {
                // Skip drawing dots that overlap with elements
                if (isInsideAnyElement(dot.originalX, dot.originalY)) {
                    return;
                }

                // Calculate distance from mouse
                const dx = mouseRef.current.x - dot.x;
                const dy = mouseRef.current.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = effectiveConfig.maxDistance;

                if (distance < maxDistance) {
                    // Push dot away from mouse
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);

                    dot.vx -= Math.cos(angle) * force * effectiveConfig.pushForce;
                    dot.vy -= Math.sin(angle) * force * effectiveConfig.pushForce;
                }

                // Return to original position
                const returnForce = effectiveConfig.returnForce;

                dot.vx += (dot.originalX - dot.x) * returnForce;
                dot.vy += (dot.originalY - dot.y) * returnForce;

                // Apply friction
                dot.vx *= effectiveConfig.friction;
                dot.vy *= effectiveConfig.friction;

                // Update position
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Draw dot with opacity
                ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Set up event listeners and initialize
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();
        animationRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, [effectiveConfig.dotColor, effectiveConfig.dotOpacity, effectiveConfig.dotSize, effectiveConfig.friction, effectiveConfig.maxDistance, effectiveConfig.pushForce, effectiveConfig.returnForce, effectiveConfig.targetDotCount, isInsideAnyElement]);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
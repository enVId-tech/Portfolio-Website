'use client';
import React, { useEffect, useRef, useMemo } from 'react';
import styles from '@/styles/dotbackground.module.scss';

/**
 * Represents a single dot in the background animation.
 */
interface Dot {
    x: number; // Current x-coordinate of the dot
    y: number; // Current y-coordinate of the dot
    originalX: number; // Original x-coordinate of the dot
    originalY: number; // Original y-coordinate of the dot
    size: number; // Size (radius) of the dot
    color: string; // Color of the dot
    opacity: number; // Opacity of the dot
    vx: number; // Velocity in the x-direction
    vy: number; // Velocity in the y-direction
}

/**
 * Configuration options for the DotBackground component.
 */
interface DotBackgroundConfig {
    spacingBetweenDots?: number; // Spacing between dots in pixels
    maxDistance?: number; // Maximum distance for mouse interaction
    dotSize?: number; // Size of the dots
    dotOpacity?: number; // Opacity of the dots
    dotColor?: string; // Color of the dots
    returnForce?: number; // Force that returns dots to their original position
    friction?: number; // Friction applied to dot movement
    pushForce?: number; // Force applied when the mouse interacts with dots
    edgePadding?: number; // Padding around the edges of the canvas
}

/**
 * Props for the DotBackground component.
 */
type DotBackgroundProps = {
    children?: React.ReactNode; // Child elements to render inside the component
    config?: DotBackgroundConfig; // Configuration options for the background
}

/**
 * A React component that renders an animated dot background.
 * The dots respond to mouse movement and return to their original positions.
 *
 * @param {DotBackgroundProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered DotBackground component.
 */
export default function DotBackground({
                                          children,
                                          config = {}
                                      }: DotBackgroundProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas element
    const contentRef = useRef<HTMLDivElement>(null); // Reference to the content container
    const containerRef = useRef<HTMLDivElement>(null); // Reference to the outer container
    const dotsRef = useRef<Dot[]>([]); // Reference to the array of dots
    const mouseRef = useRef({ x: 0, y: 0 }); // Reference to the mouse position
    const animationRef = useRef<number>(0); // Reference to the animation frame ID

    // Memoize the configuration to prevent unnecessary re-renders
    const effectiveConfig = useMemo(() => ({
        spacingBetweenDots: 80,
        maxDistance: 100,
        dotSize: 1.5,
        dotOpacity: 0.7,
        dotColor: 'rgb(255, 255, 255)',
        returnForce: 0.2,
        friction: 0.4,
        pushForce: 2,
        edgePadding: 20,
        ...config
    }), [config]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const content = contentRef.current;
        if (!canvas || !container || !content) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        /**
         * Throttles a function to limit its execution rate.
         *
         * @param {Function} fn - The function to throttle.
         * @param {number} delay - The delay in milliseconds.
         * @returns {Function} The throttled function.
         */
        const throttle = (fn: { (e: MouseEvent): void; (): void; (arg0: unknown): void; }, delay: number) => {
            let lastCall = 0;
            return (...args: unknown[]) => {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    fn(...args);
                }
            };
        };

        const lastDimensions = {
            width: window.innerWidth,
            height: document.body.scrollHeight
        };

        /**
         * Initializes the dots based on the current configuration and canvas size.
         */
        const initDots = () => {
            const spacing = effectiveConfig.spacingBetweenDots;
            const documentWidth = Math.max(document.body.clientWidth, window.innerWidth);
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                window.innerHeight
            );

            const extraBuffer = effectiveConfig.maxDistance * 2;
            const cols = Math.ceil((documentWidth + extraBuffer) / spacing);
            const rows = Math.ceil((documentHeight + extraBuffer) / spacing);

            // Update tracked dimensions
            lastDimensions.width = documentWidth;
            lastDimensions.height = documentHeight;

            const dots: Dot[] = [];
            const startX = -extraBuffer / 2;
            const startY = -extraBuffer / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = startX + (i * spacing);
                    const y = startY + (j * spacing);

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

        /**
         * Resizes the canvas to match the document dimensions and reinitializes dots.
         */
        const resizeCanvas = () => {
            canvas.height = 0;
            canvas.style.height = '0px';

            const documentWidth = Math.min(document.body.clientWidth, window.innerWidth);
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                window.innerHeight
            );

            // Resize if dimensions changed significantly
            if (
                Math.abs(canvas.width - documentWidth) > 1 ||
                Math.abs(canvas.height - documentHeight) > 1
            ) {
                canvas.width = documentWidth;
                canvas.height = documentHeight;
                canvas.style.width = `${documentWidth}px`;
                canvas.style.height = `${documentHeight}px`;

                initDots();
            }
        };

        /**
         * Handles mouse movement and updates the mouse position.
         *
         * @param {MouseEvent} e - The mouse event.
         */
        const handleMouseMove = throttle((e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY + window.scrollY;
        }, 16); // ~60fps

        /**
         * Animates the dots, applying forces and rendering them on the canvas.
         */
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { maxDistance, pushForce, returnForce, friction } = effectiveConfig;
            const visibleTop = window.scrollY - maxDistance * 2;
            const visibleBottom = window.scrollY + window.innerHeight + maxDistance * 2;
            const visibleLeft = -maxDistance * 2;
            const visibleRight = window.innerWidth + maxDistance * 2;
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            // Batch drawing operations for performance
            ctx.beginPath();

            dotsRef.current.forEach(dot => {
                // Skip dots outside visible area
                if (
                    dot.y < visibleTop ||
                    dot.y > visibleBottom ||
                    dot.x < visibleLeft ||
                    dot.x > visibleRight
                ) {
                    return;
                }

                const dx = mouseX - dot.x;
                const dy = mouseY - dot.y;
                const distanceSquared = dx * dx + dy * dy;

                // Use squared distance for performance
                if (distanceSquared < maxDistance * maxDistance) {
                    const distance = Math.sqrt(distanceSquared);
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);

                    dot.vx -= Math.cos(angle) * force * pushForce;
                    dot.vy -= Math.sin(angle) * force * pushForce;
                }

                // Apply return force and friction
                dot.vx += (dot.originalX - dot.x) * returnForce;
                dot.vy += (dot.originalY - dot.y) * returnForce;

                dot.vx *= friction;
                dot.vy *= friction;

                dot.x += dot.vx;
                dot.y += dot.vy;

                // Draw dot
                ctx.moveTo(dot.x + dot.size, dot.y);
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            });

            // Set fill style and fill all dots at once
            ctx.fillStyle = effectiveConfig.dotColor.replace('rgb', 'rgba').replace(')', `, ${effectiveConfig.dotOpacity})`);
            ctx.fill();

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Throttled resize handler
        const throttledResize = throttle(resizeCanvas, 100);
        window.addEventListener('resize', throttledResize);

        // Set up ResizeObservers for both document body and content
        const documentObserver = new ResizeObserver(throttledResize);
        documentObserver.observe(document.body);

        const contentObserver = new ResizeObserver(throttledResize);
        contentObserver.observe(content);

        // Check height periodically for dynamic content changes
        const heightCheckInterval = setInterval(() => {
            const currentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                window.innerHeight
            );

            if (Math.abs(lastDimensions.height - currentHeight) > 5) {
                throttledResize();
            }
        }, 1000);

        // Initial setup
        resizeCanvas();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', throttledResize);
            documentObserver.disconnect();
            contentObserver.disconnect();
            clearInterval(heightCheckInterval);
            cancelAnimationFrame(animationRef.current);
        };
    }, [effectiveConfig]);

    return (
        <div className={styles.container} ref={containerRef}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
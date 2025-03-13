'use client';
import React, { useEffect, useRef } from 'react';
import styles from '@/styles/dotbackground.module.scss';

/**
 * Interface representing a dot in the background.
 */
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

/**
 * Configuration options for the DotBackground component.
 */
interface DotBackgroundConfig {
    spacingBetweenDots?: number;
    maxDistance?: number;
    dotSize?: number;
    dotOpacity?: number;
    dotColor?: string;
    returnForce?: number;
    friction?: number;
    pushForce?: number;
    edgePadding?: number;
}

/**
 * Props for the DotBackground component.
 */
type DotBackgroundProps = {
    children?: React.ReactNode;
    config?: DotBackgroundConfig;
}

/**
 * DotBackground component that renders a canvas with animated dots in the background.
 * @param {DotBackgroundProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered DotBackground component.
 */
export default function DotBackground({
                                          children,
                                          config = {}
                                      }: DotBackgroundProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>(0);

    const effectiveConfig = {
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
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        /**
         * Initializes the dots based on the configuration.
         */
        const initDots = () => {
            const spacing = effectiveConfig.spacingBetweenDots;
            const documentWidth = Math.max(document.body.clientWidth, window.innerWidth);
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                window.innerHeight
            );

            const extraBuffer = effectiveConfig.maxDistance * 2;
            const cols = Math.ceil((documentWidth + extraBuffer) / spacing);
            const rows = Math.ceil((documentHeight + extraBuffer) / spacing);

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
         * Resizes the canvas to match the document dimensions.
         */
        const resizeCanvas = () => {
            const documentWidth = Math.min(document.body.clientWidth, window.innerWidth);
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                window.innerHeight
            );

            canvas.width = documentWidth;
            canvas.height = documentHeight;
            canvas.style.width = `${documentWidth}px`;
            canvas.style.height = `${documentHeight}px`;

            initDots();
        };

        /**
         * Handles mouse move events to update the mouse position.
         * @param {MouseEvent} e - The mouse event.
         */
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY + window.scrollY;
        };

        /**
         * Animates the dots on the canvas.
         */
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const visibleTop = window.scrollY - effectiveConfig.maxDistance;
            const visibleBottom = window.scrollY + window.innerHeight + effectiveConfig.maxDistance;
            const visibleLeft = -effectiveConfig.maxDistance;
            const visibleRight = window.innerWidth + effectiveConfig.maxDistance;

            dotsRef.current.forEach(dot => {
                if (
                    dot.y < visibleTop - effectiveConfig.maxDistance ||
                    dot.y > visibleBottom + effectiveConfig.maxDistance ||
                    dot.x < visibleLeft - effectiveConfig.maxDistance ||
                    dot.x > visibleRight + effectiveConfig.maxDistance
                ) {
                    return;
                }

                const dx = mouseRef.current.x - dot.x;
                const dy = mouseRef.current.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < effectiveConfig.maxDistance) {
                    const force = (effectiveConfig.maxDistance - distance) / effectiveConfig.maxDistance;
                    const angle = Math.atan2(dy, dx);

                    dot.vx -= Math.cos(angle) * force * effectiveConfig.pushForce;
                    dot.vy -= Math.sin(angle) * force * effectiveConfig.pushForce;
                }

                dot.vx += (dot.originalX - dot.x) * effectiveConfig.returnForce;
                dot.vy += (dot.originalY - dot.y) * effectiveConfig.returnForce;

                dot.vx *= effectiveConfig.friction;
                dot.vy *= effectiveConfig.friction;

                dot.x += dot.vx;
                dot.y += dot.vy;

                ctx.fillStyle = dot.color.replace('rgb', 'rgba').replace(')', `, ${dot.opacity})`);
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        resizeObserver.observe(document.body);

        resizeCanvas();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationRef.current);
        };
    }, [effectiveConfig.spacingBetweenDots, effectiveConfig.dotColor, effectiveConfig.dotOpacity, effectiveConfig.dotSize, effectiveConfig.friction, effectiveConfig.maxDistance, effectiveConfig.pushForce, effectiveConfig.returnForce]);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
'use client';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import styles from '@/styles/dotbackground.module.scss';

// Use typed arrays for better memory layout and performance
interface DotsData {
    x: Float32Array;
    y: Float32Array;
    originalX: Float32Array;
    originalY: Float32Array;
    vx: Float32Array;
    vy: Float32Array;
    count: number;
}

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

type DotBackgroundProps = {
    children?: React.ReactNode;
    config?: DotBackgroundConfig;
};

export default function DotBackground({
                                          children,
                                          config = {}
                                      }: DotBackgroundProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<DotsData | null>(null);
    const mouseRef = useRef({ x: -9999, y: -9999, active: false });
    const animationRef = useRef<number>(0);
    const isAnimatingRef = useRef(false);
    const lastFrameTimeRef = useRef(0);

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

    // Pre-compute the fill style to avoid string operations in render loop
    const fillStyle = useMemo(() => {
        const { dotColor, dotOpacity } = effectiveConfig;
        return dotColor.replace('rgb', 'rgba').replace(')', `, ${dotOpacity})`);
    }, [effectiveConfig]);

    // Memoize squared max distance to avoid multiplication in hot path
    const maxDistanceSquared = useMemo(() => 
        effectiveConfig.maxDistance * effectiveConfig.maxDistance, 
        [effectiveConfig.maxDistance]
    );

    const initDots = useCallback((documentWidth: number, documentHeight: number) => {
        const spacing = effectiveConfig.spacingBetweenDots;
        const extraBuffer = effectiveConfig.maxDistance * 2;
        const cols = Math.ceil((documentWidth + extraBuffer) / spacing);
        const rows = Math.ceil((documentHeight + extraBuffer) / spacing);
        const count = cols * rows;

        // Use typed arrays for better performance
        const dots: DotsData = {
            x: new Float32Array(count),
            y: new Float32Array(count),
            originalX: new Float32Array(count),
            originalY: new Float32Array(count),
            vx: new Float32Array(count),
            vy: new Float32Array(count),
            count
        };

        const startX = -extraBuffer / 2;
        const startY = -extraBuffer / 2;
        let index = 0;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const posX = startX + (i * spacing);
                const posY = startY + (j * spacing);
                dots.x[index] = posX;
                dots.y[index] = posY;
                dots.originalX[index] = posX;
                dots.originalY[index] = posY;
                // vx and vy are already 0 from Float32Array initialization
                index++;
            }
        }

        dotsRef.current = dots;
    }, [effectiveConfig.spacingBetweenDots, effectiveConfig.maxDistance]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const content = contentRef.current;
        if (!canvas || !container || !content) return;

        // Use willReadFrequently: false since we only write to the canvas
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        const lastDimensions = {
            width: window.innerWidth,
            height: document.body.scrollHeight
        };

        const resizeCanvas = () => {
            const documentWidth = Math.min(document.body.clientWidth, window.innerWidth);
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                window.innerHeight
            );

            if (
                Math.abs(lastDimensions.width - documentWidth) > 10 ||
                Math.abs(lastDimensions.height - documentHeight) > 10
            ) {
                lastDimensions.width = documentWidth;
                lastDimensions.height = documentHeight;

                canvas.width = documentWidth;
                canvas.height = documentHeight;
                canvas.style.width = `${documentWidth}px`;
                canvas.style.height = `${documentHeight}px`;

                initDots(documentWidth, documentHeight);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY + window.scrollY;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        };

        const animate = (timestamp: number) => {
            // Target 30 FPS for better performance (every ~33ms)
            if (timestamp - lastFrameTimeRef.current < 33) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTimeRef.current = timestamp;

            const dots = dotsRef.current;
            if (!dots) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const { maxDistance, pushForce, returnForce, friction, dotSize } = effectiveConfig;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            
            // Expand visible area slightly for smoother edges
            const visibleTop = scrollY - maxDistance;
            const visibleBottom = scrollY + windowHeight + maxDistance;
            const visibleLeft = -maxDistance;
            const visibleRight = windowWidth + maxDistance;
            
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const mouseActive = mouseRef.current.active;

            // Clear only the visible portion for better performance
            ctx.clearRect(0, visibleTop, windowWidth, windowHeight + maxDistance * 2);

            ctx.beginPath();

            const { x, y, originalX, originalY, vx, vy, count } = dots;
            const PI2 = Math.PI * 2;

            // Process dots in batches for better cache locality
            for (let i = 0; i < count; i++) {
                const dotY = y[i];
                const dotX = x[i];

                // Early visibility culling
                if (dotY < visibleTop || dotY > visibleBottom || 
                    dotX < visibleLeft || dotX > visibleRight) {
                    continue;
                }

                // Only calculate mouse interaction if mouse is active and nearby
                if (mouseActive) {
                    const dx = mouseX - dotX;
                    const dy = mouseY - dotY;
                    const distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < maxDistanceSquared) {
                        const distance = Math.sqrt(distanceSquared);
                        const force = (maxDistance - distance) / maxDistance;
                        const angle = Math.atan2(dy, dx);
                        const pushX = Math.cos(angle) * force * pushForce;
                        const pushY = Math.sin(angle) * force * pushForce;
                        vx[i] -= pushX;
                        vy[i] -= pushY;
                    }
                }

                // Spring physics - return to original position
                vx[i] += (originalX[i] - dotX) * returnForce;
                vy[i] += (originalY[i] - dotY) * returnForce;

                // Apply friction
                vx[i] *= friction;
                vy[i] *= friction;

                // Update position
                x[i] += vx[i];
                y[i] += vy[i];

                // Draw dot
                ctx.moveTo(x[i] + dotSize, y[i]);
                ctx.arc(x[i], y[i], dotSize, 0, PI2);
            }

            ctx.fillStyle = fillStyle;
            ctx.fill();

            animationRef.current = requestAnimationFrame(animate);
        };

        // Use passive event listeners for better scroll performance
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        // Debounced resize handler
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // Use a single ResizeObserver for body
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        });
        resizeObserver.observe(document.body);

        resizeCanvas();
        isAnimatingRef.current = true;
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationRef.current);
            isAnimatingRef.current = false;
        };
    }, [effectiveConfig, fillStyle, maxDistanceSquared, initDots]);

    return (
        <div className={styles.container} ref={containerRef}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
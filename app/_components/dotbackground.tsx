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
    extraRowsAboveBelow?: number; // Number of extra dot rows to render above/below viewport
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
    const cachedDotsRef = useRef<DotsData | null>(null);
    const cachedMouseRef = useRef({ x: -9999, y: -9999 });
    const previousMouseActiveRef = useRef(false);
    const canvasOffsetRef = useRef(0); // Track the current canvas Y offset (in steps)

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
        extraRowsAboveBelow: 3, // Render 3 extra rows above and below viewport
        ...config
    }), [config]);

    // Calculate the step size (spacing + dotSize for the threshold)
    const stepSize = useMemo(() => effectiveConfig.spacingBetweenDots, [effectiveConfig.spacingBetweenDots]);

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

    const initDots = useCallback((documentWidth: number, canvasHeight: number) => {
        const spacing = effectiveConfig.spacingBetweenDots;
        const extraBuffer = effectiveConfig.maxDistance * 2;
        const cols = Math.ceil((documentWidth + extraBuffer) / spacing);
        const rows = Math.ceil((canvasHeight + extraBuffer) / spacing);
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

        const { extraRowsAboveBelow, spacingBetweenDots } = effectiveConfig;
        // Calculate extra height for dots above and below viewport
        const extraHeight = extraRowsAboveBelow * spacingBetweenDots;

        const resizeCanvas = () => {
            const documentWidth = Math.min(document.body.clientWidth, window.innerWidth);
            // Canvas height = viewport + extra rows above + extra rows below
            const canvasHeight = window.innerHeight + (extraHeight * 2);

            canvas.width = documentWidth;
            canvas.height = canvasHeight;
            canvas.style.width = `${documentWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            // Initialize canvas position with absolute positioning (relative to container)
            // The canvas only moves in discrete JUMPS, not smooth scrolling
            const scrollY = window.scrollY;
            const currentStep = Math.floor(scrollY / stepSize);
            canvasOffsetRef.current = currentStep;
            
            // Position canvas at discrete step positions
            // top = (step * stepSize) - extraHeight
            // At step 0: top = -extraHeight (extra rows above viewport)
            // At step 1: top = stepSize - extraHeight
            // This makes canvas "jump" by exactly stepSize when crossing boundaries
            canvas.style.top = `${(currentStep * stepSize) - extraHeight}px`;

            // If dots are stretched out, fix the canvasHeight and make sure it is viewport height and not document height
            initDots(documentWidth, canvasHeight);
            // Reset cache on resize
            cachedDotsRef.current = null;
        };

        // Update canvas position based on scroll - DISCRETE STEPS ONLY
        // Canvas stays completely still within a step, then JUMPS when boundary is crossed
        const updateCanvasPosition = () => {
            const scrollY = window.scrollY;
            const newStep = Math.floor(scrollY / stepSize);
            
            // Only move canvas when we cross a step boundary
            if (newStep !== canvasOffsetRef.current) {
                canvasOffsetRef.current = newStep;
                // Jump to new position - canvas moves down by stepSize
                canvas.style.top = `${(newStep * stepSize) - extraHeight}px`;
            }
            // If within the same step, canvas doesn't move at all
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            // Adjust mouse Y to account for canvas offset (convert page coords to canvas coords)
            // Canvas top = (step * stepSize) - extraHeight
            // Mouse in canvas coords = mousePageY - canvasTop
            const canvasTop = (canvasOffsetRef.current * stepSize) - extraHeight;
            mouseRef.current.y = e.clientY + window.scrollY - canvasTop;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        };

        const animate = (timestamp: number) => {
            const dots = dotsRef.current;
            if (!dots) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const mouseActive = mouseRef.current.active;

            // Handle state caching and restoration
            if (mouseActive !== previousMouseActiveRef.current) {
                if (mouseActive) {
                    // Becoming active, restore cached state
                    if (cachedDotsRef.current) {
                        dots.x.set(cachedDotsRef.current.x);
                        dots.y.set(cachedDotsRef.current.y);
                        dots.vx.set(cachedDotsRef.current.vx);
                        dots.vy.set(cachedDotsRef.current.vy);
                    }
                    mouseRef.current.x = cachedMouseRef.current.x;
                    mouseRef.current.y = cachedMouseRef.current.y;
                } else {
                    // Becoming inactive, cache current state
                    cachedDotsRef.current = {
                        x: new Float32Array(dots.x),
                        y: new Float32Array(dots.y),
                        originalX: dots.originalX,
                        originalY: dots.originalY,
                        vx: new Float32Array(dots.vx),
                        vy: new Float32Array(dots.vy),
                        count: dots.count
                    };
                    cachedMouseRef.current = { x: mouseRef.current.x, y: mouseRef.current.y };
                }
                previousMouseActiveRef.current = mouseActive;
            }

            // Adjust FPS based on mouse activity
            const targetFPS = mouseActive ? 30 : 5;
            const frameInterval = 1000 / targetFPS;
            if (timestamp - lastFrameTimeRef.current < frameInterval) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTimeRef.current = timestamp;

            const { maxDistance, pushForce, returnForce, friction, dotSize } = effectiveConfig;
            
            // Calculate canvas-relative visible area
            // The canvas is positioned at (currentStep * stepSize - extraHeight)
            // So visible area in canvas coordinates is from extraHeight to extraHeight + windowHeight
            // plus some buffer for smoother edges
            const canvasHeight = canvas.height;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // For canvas-local coordinates, we render dots from 0 to canvasHeight
            // The visible portion in canvas coords when scrollY is at a step boundary
            // is approximately from extraHeight to extraHeight + windowHeight
            // But we want to render the full canvas for smooth scrolling within a step
            const visibleTop = -maxDistance;
            const visibleBottom = canvasHeight + maxDistance;
            const visibleLeft = -maxDistance;
            const visibleRight = windowWidth + maxDistance;

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                vy[i] *= friction;
                vy[i] += (originalY[i] - dotY) * returnForce;
                vx[i] *= friction;

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
        window.addEventListener('scroll', updateCanvasPosition, { passive: true });

        // Debounced resize handler
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        };

        window.addEventListener('resize', handleResize);

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
            window.removeEventListener('scroll', updateCanvasPosition);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationRef.current);
            isAnimatingRef.current = false;
        };
    }, [effectiveConfig, fillStyle, maxDistanceSquared, initDots, stepSize]);

    return (
        <div className={styles.container} ref={containerRef}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
'use client';
import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
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

type DotCanvasProps = {
    config: DotBackgroundConfig;
    contentRef: React.RefObject<HTMLDivElement | null>;
};

// Canvas component that only renders on the client
function DotCanvas({ config, contentRef }: DotCanvasProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotsRef = useRef<DotsData | null>(null);
    const mouseRef = useRef({ x: -9999, y: -9999, active: false });
    const animationRef = useRef<number>(0);
    const lastFrameTimeRef = useRef(0);
    const cachedDotsRef = useRef<DotsData | null>(null);
    const cachedMouseRef = useRef({ x: -9999, y: -9999 });
    const previousMouseActiveRef = useRef(false);
    const canvasOffsetRef = useRef(0);
    const [isReady, setIsReady] = useState(false);

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
        extraRowsAboveBelow: 3,
        ...config
    }), [config]);

    const stepSize = useMemo(() => effectiveConfig.spacingBetweenDots, [effectiveConfig.spacingBetweenDots]);

    const fillStyle = useMemo(() => {
        const { dotColor, dotOpacity } = effectiveConfig;
        return dotColor.replace('rgb', 'rgba').replace(')', `, ${dotOpacity})`);
    }, [effectiveConfig]);

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
                index++;
            }
        }

        dotsRef.current = dots;
    }, [effectiveConfig.spacingBetweenDots, effectiveConfig.maxDistance]);

    // Wait for the document to be fully loaded before initializing
    useEffect(() => {
        // Use requestAnimationFrame to ensure we're in a browser paint cycle
        // This guarantees window dimensions are accurate
        const checkReady = () => {
            if (document.readyState === 'complete') {
                // Additional frame to ensure layout is complete
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsReady(true);
                    });
                });
            } else {
                window.addEventListener('load', () => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            setIsReady(true);
                        });
                    });
                }, { once: true });
            }
        };
        
        checkReady();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const canvas = canvasRef.current;
        const content = contentRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        const { extraRowsAboveBelow, spacingBetweenDots } = effectiveConfig;
        const extraHeight = extraRowsAboveBelow * spacingBetweenDots;

        const resizeCanvas = () => {
            // Get dimensions directly from window - guaranteed to be available now
            const documentWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Fallback check
            if (viewportHeight <= 0 || documentWidth <= 0) {
                console.warn('Invalid viewport dimensions, retrying...');
                requestAnimationFrame(resizeCanvas);
                return;
            }
            
            const canvasHeight = viewportHeight + (extraHeight * 2);

            canvas.width = documentWidth;
            canvas.height = canvasHeight;
            canvas.style.width = `${documentWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            const scrollY = window.scrollY;
            const currentStep = Math.floor(scrollY / stepSize);
            canvasOffsetRef.current = currentStep;
            canvas.style.top = `${(currentStep * stepSize) - extraHeight}px`;

            initDots(documentWidth, canvasHeight);
            cachedDotsRef.current = null;
        };

        const updateCanvasPosition = () => {
            const scrollY = window.scrollY;
            const newStep = Math.floor(scrollY / stepSize);
            
            if (newStep !== canvasOffsetRef.current) {
                canvasOffsetRef.current = newStep;
                canvas.style.top = `${(newStep * stepSize) - extraHeight}px`;
            }

            if (content) {
                if (scrollY > content.offsetHeight - window.innerHeight) {
                    window.scrollTo(0, content.offsetHeight - window.innerHeight);
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
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

            if (mouseActive !== previousMouseActiveRef.current) {
                if (mouseActive) {
                    if (cachedDotsRef.current) {
                        dots.x.set(cachedDotsRef.current.x);
                        dots.y.set(cachedDotsRef.current.y);
                        dots.vx.set(cachedDotsRef.current.vx);
                        dots.vy.set(cachedDotsRef.current.vy);
                    }
                    mouseRef.current.x = cachedMouseRef.current.x;
                    mouseRef.current.y = cachedMouseRef.current.y;
                } else {
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

            const targetFPS = mouseActive ? 30 : 5;
            const frameInterval = 1000 / targetFPS;
            if (timestamp - lastFrameTimeRef.current < frameInterval) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTimeRef.current = timestamp;

            const { maxDistance, pushForce, returnForce, friction, dotSize } = effectiveConfig;
            
            const canvasHeight = canvas.height;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            const visibleTop = -maxDistance;
            const visibleBottom = canvasHeight + maxDistance;
            const visibleLeft = -maxDistance;
            const visibleRight = windowWidth + maxDistance;

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            const { x, y, originalX, originalY, vx, vy, count } = dots;
            const PI2 = Math.PI * 2;

            for (let i = 0; i < count; i++) {
                const dotY = y[i];
                const dotX = x[i];

                if (dotY < visibleTop || dotY > visibleBottom ||
                    dotX < visibleLeft || dotX > visibleRight) {
                    continue;
                }

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

                vx[i] += (originalX[i] - dotX) * returnForce;
                vy[i] *= friction;
                vy[i] += (originalY[i] - dotY) * returnForce;
                vx[i] *= friction;

                x[i] += vx[i];
                y[i] += vy[i];

                ctx.moveTo(x[i] + dotSize, y[i]);
                ctx.arc(x[i], y[i], dotSize, 0, PI2);
            }

            ctx.fillStyle = fillStyle;
            ctx.fill();

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        window.addEventListener('scroll', updateCanvasPosition, { passive: true });
        window.addEventListener('resize', resizeCanvas);

        // Initialize canvas
        resizeCanvas();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', updateCanvasPosition);
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [effectiveConfig, fillStyle, maxDistanceSquared, initDots, stepSize, isReady, contentRef]);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}

// Dynamically import the canvas component with SSR disabled
const ClientOnlyDotCanvas = dynamic(
    () => Promise.resolve(DotCanvas),
    { 
        ssr: false,
        loading: () => <div className={styles.canvasPlaceholder} aria-hidden="true" />
    }
);

export default function DotBackground({
    children,
    config = {}
}: DotBackgroundProps): React.ReactElement {
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.container} ref={containerRef}>
            <ClientOnlyDotCanvas config={config} contentRef={contentRef} />
            <div className={styles.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
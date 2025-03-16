"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import '@/styles/globals.scss';
import { M_600 } from "@/utils/globalFonts.ts";
import Loading from '@/app/_components/loading';
import {AuthProvider} from "@/context/AuthContext.tsx";

/**
 * RootLayout component that serves as the root layout for the application.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} The rendered RootLayout component.
 */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Show loading state at the start of navigation
        setIsLoading(true);

        // Small delay to ensure the loading screen appears
        // even for very fast page transitions
        const handleRouteChangeComplete = () => {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 100);

            return () => clearTimeout(timer);
        };

        // Execute once when the route changes
        handleRouteChangeComplete();
    }, [pathname, searchParams]);

    return (
        <html lang="en">
        <body className={M_600}>
        <Loading isLoading={isLoading}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Loading>
        </body>
        </html>
    );
}
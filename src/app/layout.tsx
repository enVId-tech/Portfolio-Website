"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
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
    return (
        <html lang="en">
        <body className={M_600}>
        <Suspense fallback={<div>Loading...</div>}>
            <PageTransitions>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </PageTransitions>
        </Suspense>
        </body>
        </html>
    );
}

// This component handles page transitions
function PageTransitions({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Show loading state when navigation starts
        setIsLoading(true);

        // Hide loading state shortly after navigation completes
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <Loading isLoading={isLoading}>
            {children}
        </Loading>
    );
}
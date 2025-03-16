"use client";
import React, { Suspense } from 'react';
import '@/styles/globals.scss';
import { M_600 } from "@/utils/globalFonts.ts";
import Loading from '@/app/_components/loading';
import {AuthProvider} from "@/context/AuthContext.tsx";

interface State {
    children: React.ReactNode;
}

/**
 * RootLayout component that serves as the root layout for the application.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} The rendered RootLayout component.
 */

export default function RootLayout({ children }: State) {
    return (
        <html lang="en">
        <body className={M_600}>
        <Suspense fallback={<div>Loading...</div>}>
            <NavigationManager>
                <AuthProvider>
                {children}
                </AuthProvider>
            </NavigationManager>
        </Suspense>
        </body>
        </html>
    );
}

function NavigationManager({ children }: State) {
    // Navigation state management here
    return (
        <Loading isLoading={false}>
            {children}
        </Loading>
    );
}
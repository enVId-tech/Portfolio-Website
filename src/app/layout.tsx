import React from 'react';
import '@/styles/globals.scss';
import {AuthProvider} from "@/context/AuthContext.tsx";
import {M_600} from "@/utils/globalFonts.ts";

/**
 * Metadata for the webpage.
 */
export const metadata = {
    title: 'enVId Tech - Home Page',
    description: 'enVId Tech - Personal Webpage',
}

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
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content={metadata.description} />
            <link rel="icon" href="/favicon/favicon.ico" />
            <title>{metadata.title}</title>
        </head>
            <body className={M_600}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
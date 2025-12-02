import React, { Suspense } from 'react';
import '@/styles/globals.scss';
import { M_600 } from "@/utils/globalFonts.ts";
import {AuthProvider} from "@/context/AuthContext.tsx";
import ClientLayout from './client-layout';

export const metadata = {
    title: {
        template: '%s | Erick Tran - Full Stack Developer',
        default: 'Erick Tran - Full Stack Developer | React, Next.js, Node.js Expert',
    },
    description: 'Erick Tran is a skilled full stack developer with 3+ years of experience in React, Next.js, Node.js, and modern web technologies. Explore my portfolio of innovative web applications and development projects.',
    keywords: [
        'Erick Tran',
        'Full Stack Developer',
        'React Developer',
        'Next.js Developer',
        'Node.js Developer',
        'TypeScript',
        'JavaScript',
        'Web Developer',
        'Frontend Developer',
        'Backend Developer',
        'Portfolio',
        'Software Engineer'
    ],
    authors: [{ name: 'Erick Tran', url: 'https://etran.dev' }],
    creator: 'Erick Tran',
    publisher: 'Erick Tran',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://etran.dev'),
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
                <meta name="theme-color" content="#1a1a1a" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={M_600}>
            <Suspense fallback={<div>Loading...</div>}>
                <ClientLayout>
                    <AuthProvider>
                       {children}
                    </AuthProvider>
                </ClientLayout>
            </Suspense>
            </body>
        </html>
    );
}
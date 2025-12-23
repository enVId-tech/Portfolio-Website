import React, { Suspense } from 'react';
import '@/styles/globals.scss';
import '@/utils/consoleOverride';
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
        'Software Engineer',
        'Web Applications',
        'MongoDB',
        'Express.js',
        'MERN Stack',
        'etran.dev'
    ],
    icons: {
        icon: [
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
    },
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
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://etran.dev',
        siteName: 'Erick Tran Portfolio',
        title: 'Erick Tran - Full Stack Developer',
        description: 'Full Stack Developer with 3+ years of experience in React, Next.js, Node.js, and modern web technologies. View my portfolio of innovative web applications.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Erick Tran - Full Stack Developer Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Erick Tran - Full Stack Developer',
        description: 'Full Stack Developer specializing in React, Next.js, Node.js & TypeScript. Explore my portfolio of web applications.',
        images: ['/og-image.jpg'],
        creator: '@ericktran',
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
    category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* DNS Prefetch and Preconnect for performance */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Google Analytics (gtag.js) - set NEXT_PUBLIC_GA_ID in env */}
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
                        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });` }} />
                    </>
                )}
                {/* Manifest and Icons */}
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
                
                {/* Theme and Viewport */}
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
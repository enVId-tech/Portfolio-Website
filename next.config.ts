import type { NextConfig } from "next";
import { version } from "./package.json";

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const cacheControl = (sMaxAge: number, staleWhileRevalidate: number) => ({
    key: 'Cache-Control',
    value: `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
});

const nextConfig: NextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: isDev ? 0 : 3600,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    env: {
        APP_VERSION: version,
    },

    // Performance optimizations
    compress: !isDev,
    poweredByHeader: false,

    // Experimental features for performance
    experimental: {
        optimizeCss: !isDev,
        optimizePackageImports: [
            'react-icons/fa',
            'react-icons/si',
            'react-icons/fa6',
            'react-icons/bs',
            'react-icons/vsc',
        ],
    },

    // Turbopack configuration for Next.js 16+
    turbopack: {},
    async headers() {
        if (isDev) {
            // No cache headers in development
            return [
                {
                    source: '/(.*)',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        },
                        ...securityHeaders,
                    ],
                },
            ];
        }

        // Next.js applies every matching rule in order and a later rule overrides an earlier one for the same header,
        // so the defaults come first and the more specific routes after them.
        return [
            {
                source: '/(.*)',
                headers: [
                    cacheControl(1200, 600), // Default 20 min cache
                    ...securityHeaders,
                ],
            },
            {
                source: '/blogs/:path*',
                headers: [cacheControl(900, 600)], // 15 min cache, 10 min stale
            },
            {
                source: '/api/tech',
                headers: [cacheControl(1200, 600)], // 20 min cache
            },
            {
                source: '/api/timeline',
                headers: [cacheControl(1200, 600)], // 20 min cache
            },
            {
                source: '/api/projects',
                headers: [cacheControl(600, 900)], // 10 min cache, 15 min stale
            },
            {
                source: '/api/github-repos',
                headers: [cacheControl(600, 900)], // 10 min cache, 15 min stale
            },
            {
                source: '/api/blogs/:path*',
                headers: [cacheControl(600, 300)], // 10 min cache
            },
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/image(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, stale-while-revalidate=1800', // 1 hour cache
                    },
                ],
            },
        ]
    },
};

export default nextConfig;

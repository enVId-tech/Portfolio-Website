import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: isDev ? 0 : 3600, // 1 hour in production
    },
    compress: !isDev,
    poweredByHeader: false,
    experimental: {
        optimizeCss: !isDev,
        optimizePackageImports: ['react-icons'],
    },
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
                        {
                            key: 'X-Content-Type-Options',
                            value: 'nosniff',
                        },
                        {
                            key: 'X-Frame-Options',
                            value: 'DENY',
                        },
                        {
                            key: 'X-XSS-Protection',
                            value: '1; mode=block',
                        },
                        {
                            key: 'Referrer-Policy',
                            value: 'strict-origin-when-cross-origin',
                        },
                    ],
                },
            ];
        }
        
        return [
            {
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // 20 min cache, 10 min stale
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/blogs/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=900, stale-while-revalidate=600', // 15 min cache, 10 min stale
                    },
                ],
            },
            {
                source: '/api/tech',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // 20 min cache
                    },
                ],
            },
            {
                source: '/api/timeline',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // 20 min cache
                    },
                ],
            },
            {
                source: '/api/projects',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // 20 min cache
                    },
                ],
            },
            {
                source: '/api/github-repos',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // 20 min cache
                    },
                ],
            },
            {
                source: '/api/blogs/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=600, stale-while-revalidate=300', // 10 min cache
                    },
                ],
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=1200, stale-while-revalidate=600', // Default 20 min cache
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
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

module.exports = nextConfig;

export default nextConfig;

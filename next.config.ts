import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

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
    
    // Performance optimizations
    compress: !isDev,
    poweredByHeader: false,
    swcMinify: true,
    
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
        webpackBuildWorker: true,
    },
    
    // Webpack optimization
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk for node_modules
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // Common chunk for shared components
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                        // Separate chunk for react-icons
                        icons: {
                            name: 'icons',
                            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
                            chunks: 'all',
                            priority: 30,
                        },
                    },
                },
            };
        }
        return config;
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

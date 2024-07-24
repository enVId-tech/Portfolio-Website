/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    serverRuntimeConfig: {
        host: '0.0.0.0',
        port: 3000,
    }
};

export default nextConfig;

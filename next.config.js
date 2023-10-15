/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.2550505.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.ihan.club',
            },
        ],
    },
}
module.exports = nextConfig;

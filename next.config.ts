import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tmssl.akamaized.net",
            },
        ],
    },
};

export default nextConfig;

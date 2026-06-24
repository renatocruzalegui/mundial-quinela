import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "flagcdn.com",
            },
        ],
    },
};

/*module.exports = {
    allowedDevOrigins: ['192.168.1.54'],
}*/

export default nextConfig;

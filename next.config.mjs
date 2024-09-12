/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/, // Apply rule to .svg files
            use: ['@svgr/webpack'], // Use SVGR to transform them into React components
        });

        return config;
    },
};

export default nextConfig;

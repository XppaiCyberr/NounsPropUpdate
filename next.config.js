/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['viem', 'wagmi'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /HeartbeatWorker/,
        })
      );
      
      config.externals = config.externals || [];
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

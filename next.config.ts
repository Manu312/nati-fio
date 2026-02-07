import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// Content-Security-Policy en modo enforce (#1, #3)
const cspHeader = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : " 'unsafe-inline'"};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self' ${isDev ? 'http://localhost:* ws://localhost:*' : process.env.NEXT_PUBLIC_API_URL || 'https://natyfio.com'};
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
`.replace(/\n/g, '');

const nextConfig: NextConfig = {
  // Optimización de paquetes para reducir cadenas de solicitudes críticas (#7)
  experimental: {
    // Inline CSS para evitar render-blocking CSS (#8)
    inlineCss: true,
    // Optimizar imports de paquetes grandes
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;


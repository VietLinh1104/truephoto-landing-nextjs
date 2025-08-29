// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'pub-222c56a43239471c83385141297e70d8.r2.dev',
      'document.truediting.com', // thêm domain này
    ],
  },
};

export default nextConfig;

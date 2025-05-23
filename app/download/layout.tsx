import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download Media Files',
  description: 'Download your professional real estate media files securely. Access your photos, virtual tours, and aerial shots anytime, anywhere.',
  openGraph: {
    title: 'Download Media Files - True Photo',
    description: 'Download your professional real estate media files securely. Access your photos, virtual tours, and aerial shots anytime, anywhere.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
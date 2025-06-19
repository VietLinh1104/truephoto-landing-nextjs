import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "True Photo - Professional Real Estate Media Services",
    template: "%s | True Photo"
  },
  description: "Professional real estate media services including photography, virtual tours, and aerial shots. Make your property listings stand out with high-quality visuals.",
  keywords: ["real estate photography", "virtual tours", "aerial photography", "property media", "real estate marketing"],
  authors: [{ name: "True Photo" }],
  creator: "True Photo",
  publisher: "True Photo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://truephoto.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "True Photo - Professional Real Estate Media Services",
    description: "Professional real estate media services including photography, virtual tours, and aerial shots. Make your property listings stand out with high-quality visuals.",
    siteName: "True Photo",
  },
  twitter: {
    card: "summary_large_image",
    title: "True Photo - Professional Real Estate Media Services",
    description: "Professional real estate media services including photography, virtual tours, and aerial shots. Make your property listings stand out with high-quality visuals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}

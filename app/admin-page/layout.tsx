import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | True Photo",
    template: "%s | Admin Dashboard"
  },
  description: "True Photo Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}


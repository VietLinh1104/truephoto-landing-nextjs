import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import type { JSX } from 'react';

export default function Home(): JSX.Element {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed z-10 w-full bg-white">
        <Navbar />
      </nav>

      {/* Header */}
      <div className="h-[107px]"></div>

      {/* Main */}
      <main></main>

      <Footer />

      <div className="w-full border-t border-primary py-1 flex justify-center">
        © 2025 by 3D Immersive. All Right Reserved
      </div>
    </>
  );
}

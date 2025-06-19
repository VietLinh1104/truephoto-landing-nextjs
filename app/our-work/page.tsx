import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import OurWorkClient from "../components/OurWorkClient";

export default function OurWorkPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed z-10 w-full bg-white">
        <Navbar />
      </nav>

      <div className="h-[107px]" />

      <div className="relative w-full h-[280px] md:h-[360px] lg:h-[420px]">
        <img
          src="https://pub-222c56a43239471c83385141297e70d8.r2.dev/2/4/43f951_696fa5388c4647fe885ee6288bc711f3_mv2_4da30a72b5.avif"
          alt="Banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <p className="text-white text-3xl md:text-5xl">See Our Work</p>
        </div>
      </div>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <OurWorkClient />
        </div>
      </main>

      <Footer />

      <div className="w-full border-t border-primary py-1 flex justify-center text-sm">
        © 2025 by True Photo. All Rights Reserved
      </div>
    </div>
  );
}

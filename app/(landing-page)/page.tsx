import Navbar from "./sections/Navbar";
import Banner from "./sections/Banner";
import RealEstateMedia from "./sections/RealEstateMedia";
import OurServices from "./sections/OurServices";
import Section3 from "./sections/Section3";
import EmailSubscription from "./sections/EmailSubscription";
import Footer from "./sections/Footer";
import type { JSX } from 'react';


export default function Home(): JSX.Element {
    return (
        <>
            {/* Navbar */}
            <nav className="fixed z-10 w-full bg-white">
                <Navbar />
            </nav>

            {/* Header */}
            <Banner />

            {/* Main */}
            <main>
                <EmailSubscription />
                <RealEstateMedia />
                <OurServices />
                <Section3 />
                {/* <QA /> */}
            </main>

            <Footer />

            <div className="w-full border-t border-primary py-1 flex justify-center">
                © 2025 by True Photo. All Right Reserved
            </div>
        </>
    );
} 
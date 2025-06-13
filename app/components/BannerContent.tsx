'use client';

import Image from "next/image";
import ScrollButton from './ScrollButton';

interface BannerData {
    video: Array<{
        url: string;
    }>;
    subtitle: string;
    title: string;
    descriptions: string;
    button: {
        URL: string;
        Text: string;
    };
}

const BannerContent = ({ data }: { data: BannerData }) => {
    const videoURL = data.video[0].url;

    // ✅ Tách riêng hàm scroll callback ra
    const handleScrollFocusEmail = () => {
        const formSection = document.getElementById("email-subscription");
        if (formSection) {
            const emailInput = formSection.querySelector('input[type="email"]');
            if (emailInput instanceof HTMLInputElement) {
                emailInput.focus();
            }
        }
    };

    return (
        <header className="relative section h-[400px] md:h-[451px] lg:h-[683px] overflow-hidden pt-[160px]" role="banner">
            <video
                src={videoURL}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="absolute top-0 left-0 w-full h-full object-cover"
                role="presentation"
            />
            <div className="container lg:w-7xl !py-0">
                <div className="relative p-6 text-white lg:w-[600px]">
                    <div className="absolute inset-0 bg-black opacity-80" aria-hidden="true"></div>
                    <div className="flex gap-4 md:gap-11 items-center ml-1.5 mb-2 md:mb-4"> 
                        <Image 
                            src="/icons/Ellipse2.svg" 
                            alt="Decorative dot" 
                            width={10} 
                            height={10} 
                            className="relative md:h-4 md:w-4"
                            aria-hidden="true"
                        />
                        <p className="relative font-montserrat md:text-lg">
                            {data.subtitle}
                        </p>
                    </div>
                    <div className="flex gap-3 md:gap-9 items-center">
                        <div className="icon flex flex-col gap-3 w-10" role="list" aria-label="Social media links">
                            {/* Social media icons can be added here */}
                        </div>
                        <div className="header flex flex-col gap-1">
                            <h1 className="relative text-white">{data.title}</h1>
                            <p className="relative md:text-lg mb-1 md:mb-4">
                                {data.descriptions}
                            </p>
                            <div className="header flex gap-2 md:gap-5 w-full mr-20">
                                <ScrollButton
                                    text={data.button.Text}
                                    targetId="email-subscription"
                                    onScrolled={handleScrollFocusEmail} // ✅ Truyền vào hàm đã tách
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BannerContent;

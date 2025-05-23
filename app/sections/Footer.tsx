// eslint-disable-next-line
import Image from "next/image";
import Link from "next/link";

interface ServiceLink {
    text: string;
    href: string;
}

export default function Footer() {
    const services: ServiceLink[] = [
        { text: "Real Estate Photography", href: "#" },
        { text: "2D/3D Floorplans", href: "#" },
        { text: "Matterport Virtual Tours", href: "#" },
        { text: "Listing Videos", href: "#" },
        { text: "Drone Photo & Video", href: "#" }
    ];

    return ( 
        <footer className="section">
            <div className="container pt-0 lg:w-7xl md:flex justify-between">
                <div className="mb-5">
                    {/* <Image 
                        src="https://pub-222c56a43239471c83385141297e70d8.r2.dev/image_1_0120db5d40.png" 
                        alt="Icon Logo" 
                        width={277} 
                        height={71} 
                        className="w-[197px] h-[50px] lg:w-[277px] lg:h-[71px]"
                    /> */}

                    <h1 className="text-primary text-2xl font-bold">TRUE PHOTO</h1>

                    <h4>Hours of Operation</h4>
                    <p>Mon - Fri<span className="pl-10">8:00 am – 6:00 pm</span></p>
                    <p>Mon - Fri<span className="pl-10">8:00 am – 6:00 pm</span></p>
                </div>

                <div className="flex flex-col mb-5">
                    <h4 className="mb-1">Services</h4>
                    {services.map((service, index) => (
                        <Link 
                            key={index}
                            href={service.href}
                            className="hover:text-primary transition-colors"
                        >
                            {service.text}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col">
                    <h4 className="mb-1">Contact</h4>
                    <a 
                        href="mailto:sales@truediting.com"
                        className="hover:text-primary transition-colors"
                    >
                        sales@truediting.com
                    </a>
                </div>
            </div>
        </footer>
    );
} 
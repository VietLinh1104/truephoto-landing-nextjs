'use client';

import { useState } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface NavLink {
    name: string;
    href: string;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "About", href: "#" },
        { name: "Services", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Our Work", href: "/our-work" }
    ];

    return ( 
        <>
            <div className="section bg-primary sm:p-0">
                <div className="container lg:w-7xl !py-1 sm:!py-1 flex gap-8">
                    <p className="md:text-lg text-white">Email Contact:</p>
                    <p className="md:text-lg text-white">sales@truediting.com</p>
                </div>
            </div>
            <div className="section !py-2 lg:!py-0">
                <div className="container lg:w-7xl py-0 md:flex justify-between">
                    {/* logo and menu btn */}
                    <div className="logo-menu flex items-center justify-between w-full">
                        {/* <Image 
                            src="https://pub-222c56a43239471c83385141297e70d8.r2.dev/2/3/image_2_371535a8db_55d7bbbb00.png" 
                            alt="Icon Logo" 
                            width={277} 
                            height={71} 
                            className="w-[197px] h-[50px] lg:w-[277px] lg:h-[71px]"
                        /> */}
                        <h1 className="text-primary text-2xl font-bold">TRUE PHOTO</h1>

                        {/* Desktop Menu */}
                        <ul className="my-2 gap-5 hidden md:flex">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="block flex hover:text-primary items-center py-2 px-4 bg-white md:bg-transparent">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="md:hidden"
                            aria-label="Toggle menu"
                        >
                            <Image 
                                src="/icons/menu-icon.svg" 
                                alt="Menu" 
                                width={22.5} 
                                height={15} 
                            />
                        </button>                
                    </div>

                    {/* Mobile Menu */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: isOpen ? 0 : '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 left-0 w-2/3 h-full bg-gray-900 p-5 shadow-lg md:hidden z-50"
                    >
                        <button
                            className="self-end text-white"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                        <ul className="flex flex-col space-y-4">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className="text-white text-lg" 
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </>
    );
} 
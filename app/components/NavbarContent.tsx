'use client';

import { useState } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ScrollLink from "./ScrollLink";

interface NavLink {
  id: number;
  field: string;
  target: string;
  type: 'scroll' | 'redirect';
}

interface Props {
  navLinks: NavLink[];
}

export default function NavbarContent({ navLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="section bg-primary sm:p-0">
        <div className="container lg:w-7xl !py-1 sm:!py-1 flex gap-8">
          <p className="md:text-lg text-white">Email Contact:</p>
          <p className="md:text-lg text-white">sales@truediting.com</p>
        </div>
      </div>

      <div className="section !py-5 lg:!py-0">
        <div className="container lg:w-7xl py-0 md:flex justify-between">
          <div className="logo-menu flex items-center justify-between w-full">
            <h1 className="text-primary text-2xl font-bold py-5">TRUE PHOTO</h1>

            <ul className="my-2 gap-5 hidden md:flex">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <ScrollLink
                    type={link.type}
                    target={link.target}
                    className="flex hover:text-primary items-center py-2 px-4 bg-white md:bg-transparent"
                  >
                    {link.field}
                  </ScrollLink>
                </li>
              ))}
            </ul>

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
              {navLinks.map((link) => (
                <li key={link.id}>
                  <ScrollLink
                    type={link.type}
                    target={link.target}
                    className="text-white text-lg"
                    onScrolled={() => setIsOpen(false)}
                  >
                    {link.field}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
}

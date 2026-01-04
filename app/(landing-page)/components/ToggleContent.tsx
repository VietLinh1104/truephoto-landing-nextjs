'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ToggleContentProps {
    title: string;
    children: ReactNode;
}

export default function ToggleContent({ title, children }: ToggleContentProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-primary py-5 cursor-pointer">
            <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center">
                <h4>{title}</h4>
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <p className="my-5">{children}</p>
            </motion.div>
        </div>
    );
} 
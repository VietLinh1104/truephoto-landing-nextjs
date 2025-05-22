'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface Card1Props {
    imgSrc: string;
    className?: string;
    children: ReactNode;
    title: string;
    subtitle: string;
    buttonText: string;
    order: number;
}

export default function Card1({ 
    imgSrc, 
    className, 
    children, 
    title, 
    subtitle, 
    buttonText, 
    order 
}: Card1Props) {
    return ( 
        <div className={`md:flex gap-12 lg:gap-20 ${className || ''}`}>
            <Image 
                src={imgSrc}
                alt="staff avatar" 
                width={490} 
                height={364} 
                className={`w-full md:w-1/2 mb-5 md:mb-0 lg:w-[490px] lg:h-auto object-contain order-${order}`}
            />

            <div className="flex flex-col md:w-1/2 md:order-0">
                <div className="gap-1.5 mb-5">
                    <h2 className="text-primary">{title}</h2>
                    <p className="mb-2 font-w01-rounded-light text-xl lg:text-2xl">{subtitle}</p>
                    <p>{children}</p>
                </div>
                <button className="btn text-primary flex items-center gap-2 hover:text-white w-fit">
                    {buttonText}
                </button>
            </div>
        </div>
     );
} 
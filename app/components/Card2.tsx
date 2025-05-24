'use client';

import Image from 'next/image';
import { ReactNode, isValidElement } from 'react';
import { formatDescription } from '../utils/format';

interface Card2Props {
    imgSrc: string;
    className?: string;
    children: ReactNode;
    title: string;
    buttonText: string;
    order: number;
}

export default function Card2({ 
    imgSrc, 
    className, 
    children, 
    title, 
    buttonText, 
    order 
}: Card2Props) {
    return ( 
        <div className={`md:flex gap-12 lg:gap-20 ${className || ''}`}>
            <Image 
                src={imgSrc}
                alt="staff avatar" 
                width={490} 
                height={364} 
                className={`w-full md:w-1/2 mb-5 md:mb-0 lg:w-[490px] h-full object-cover ${order === 1 ? "md:order-1" : "md:order-0"}`}
            />

            <div className={`flex flex-col md:w-1/2 ${order === 1 ? "md:order-0" : "md:order-1"}`}>
                <div className="gap-1.5 mb-5">
                    <h3 className="text-primary mb-3">{title}</h3>
                    <p className="whitespace-pre-line">
                        {formatDescription(children)}
                    </p>
                </div>
                <button className="btn text-primary flex items-center gap-2 hover:text-white w-fit">
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

'use client';

import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { formatDescription } from '../utils/format';
import { useRouter } from 'next/navigation';

interface Card2Props {
    imgSrc: string;
    className?: string;
    children: ReactNode;
    title: string;
    buttonText: string;
    order: number;
    buttonLink: string;
    idField: string
}

export default function Card2({ 
    imgSrc, 
    className, 
    children, 
    title, 
    buttonText, 
    buttonLink,
    order,
    idField
}: Card2Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            await router.push(buttonLink);
        } catch (error) {
            console.error('Navigation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
        <div className={`md:flex gap-12 lg:gap-20 ${className || ''}`} id={idField}>
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
                <button 
                    onClick={handleClick}
                    disabled={isLoading}
                    className={`btn text-primary flex items-center gap-2 hover:text-white w-fit ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`${buttonText} - Click to navigate to ${title}`}
                >
                    {isLoading ? 'Loading...' : buttonText}
                </button>
            </div>
        </div>
    );
}

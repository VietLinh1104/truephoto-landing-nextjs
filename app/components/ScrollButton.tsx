'use client';

import Image from "next/image";

interface ScrollButtonProps {
    text: string;
    targetId: string;
}

const ScrollButton = ({ text, targetId }: ScrollButtonProps) => {
    const handleScroll = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            // Focus on email input after scrolling
            setTimeout(() => {
                const emailInput = targetElement.querySelector('input[type="email"]');
                if (emailInput instanceof HTMLInputElement) {
                    emailInput.focus();
                }
            }, 600); // Delay to ensure smooth scroll completes
        }
    };

    return (
        <button 
            onClick={handleScroll}
            className="btn relative flex items-center gap-4"
            aria-label={`${text} - Click to scroll to ${targetId} section`}
        >
            {text}
            <span aria-hidden="true">
                <Image 
                    src="/icons/arrow-icon.svg" 
                    alt="" 
                    width={10} 
                    height={7}
                />
            </span>
        </button>
    );
};

export default ScrollButton; 
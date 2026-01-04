'use client';

import Image from "next/image";

interface ScrollButtonProps {
    text: string;
    targetId: string;
    onScrolled?: () => void; // Thêm prop hàm tùy chọn
}

const ScrollButton = ({ text, targetId, onScrolled }: ScrollButtonProps) => {
    const handleScroll = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });

            if (onScrolled) {
                setTimeout(() => {
                    onScrolled(); // Gọi callback truyền từ ngoài vào
                }, 600); // Delay sau khi scroll xong
            }
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

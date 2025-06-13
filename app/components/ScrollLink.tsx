'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ScrollLinkProps {
  type: 'scroll' | 'redirect';
  target: string;
  className?: string;
  children: ReactNode;
  onScrolled?: () => void;
  offset?: number; // thêm offset tùy chọn
}

export default function ScrollLink({
  type,
  target,
  className,
  children,
  onScrolled,
  offset = 100, // mặc định nâng lên 100px
}: ScrollLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (type === 'scroll') {
      e.preventDefault();
      const element = document.getElementById(target);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });

        if (onScrolled) onScrolled();
      }
    }
  };

  if (type === 'redirect') {
    return (
      <Link href={target} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={`#${target}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

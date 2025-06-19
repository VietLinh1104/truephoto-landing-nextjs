'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ScrollLinkProps {
  type: 'scroll' | 'redirect';
  target: string;
  className?: string;
  children: ReactNode;
  onScrolled?: () => void;
  offset?: number;
}

export default function ScrollLink({
  type,
  target,
  className,
  children,
  onScrolled,
  offset = 100,
}: ScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Sau khi component mount, kiểm tra có target trong sessionStorage không
  useEffect(() => {
    const pendingTarget = sessionStorage.getItem('scroll-target');
    if (pathname === '/' && pendingTarget) {
      const element = document.getElementById(pendingTarget);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      sessionStorage.removeItem('scroll-target');
    }
  }, [pathname]);

  const handleClick = (e: React.MouseEvent) => {
    if (type === 'scroll') {
      e.preventDefault();
      if (pathname !== '/') {
        // Nếu không ở / thì chuyển trang và lưu target
        sessionStorage.setItem('scroll-target', target);
        router.push('/');
      } else {
        const element = document.getElementById(target);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          if (onScrolled) onScrolled();
        }
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

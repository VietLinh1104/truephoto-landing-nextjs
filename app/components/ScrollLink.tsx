'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useCallback } from 'react';

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
  const searchParams = useSearchParams();

  const scrollToTarget = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        if (onScrolled) onScrolled();
      }
    },
    [offset, onScrolled]
  );

  const handleClick = (e: React.MouseEvent) => {
    if (type === 'scroll') {
      e.preventDefault();

      if (pathname !== '/') {
        router.push(`/?scrollTo=${target}`);
      } else {
        scrollToTarget(target);
      }
    }
  };

  // Auto scroll when arriving at "/" with scrollTo param
  useEffect(() => {
    if (pathname === '/') {
      const scrollTo = searchParams.get('scrollTo');
      if (scrollTo) {
        // Delay to wait for DOM render
        setTimeout(() => {
          scrollToTarget(scrollTo);
          // Optionally clean up the query param (if using router.replace)
          router.replace('/', { scroll: false });
        }, 300);
      }
    }
  }, [pathname, searchParams, scrollToTarget, router]);

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

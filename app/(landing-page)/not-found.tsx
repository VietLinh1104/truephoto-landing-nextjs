// app/not-found.tsx
import Link from 'next/link';
import type { JSX } from 'react';

export default function NotFound(): JSX.Element {
  return (
    <div className="text-center p-10 h-screen flex items-center justify-center">
      <div>
        <h1 className="text-4xl text-primary font-bold mb-4">404 - Not Found</h1>
        <p className="mb-6">The page you are looking for does not exist.</p>
        <Link href="/">
          <button className="btn font-medium">Back to home</button>
        </Link>
      </div>
    </div>
  );
}

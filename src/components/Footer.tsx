import type { JSX } from 'react';

export function Footer(): JSX.Element {
  return (
    <footer className="bg-flax-smoke-700 text-white py-2">
      <p className="flex items-center justify-center gap-2 text-xs">
        &copy; {new Date().getFullYear()} Lynh and Michael{' '}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800"
          height="800"
          fill="none"
          viewBox="0 0 16 16"
          className="h-3 w-3"
        >
          <path
            fill="#fff"
            d="M1.243 8.243 8 15l6.757-6.757a4.243 4.243 0 0 0 1.243-3v-.19A4.052 4.052 0 0 0 8.783 2.52L8 3.5l-.783-.98A4.052 4.052 0 0 0 0 5.053v.19c0 1.126.447 2.205 1.243 3Z"
          />
        </svg>
      </p>
    </footer>
  );
}

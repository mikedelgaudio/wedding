import type { JSX } from 'react';

export function Footer(): JSX.Element {
  return (
    <footer className="bg-flax-smoke-500 text-white py-4">
      <div className="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          className="text-xs"
        >
          <path
            fill="#fff"
            d="m12.82 5.58-.82.822-.824-.824a5.375 5.375 0 1 0-7.601 7.602l7.895 7.895a.75.75 0 0 0 1.06 0l7.902-7.897a5.376 5.376 0 0 0-.001-7.599 5.38 5.38 0 0 0-7.611 0Z"
          />
        </svg>{' '}
        <p className="flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} Lynh and Michael
        </p>
      </div>
    </footer>
  );
}

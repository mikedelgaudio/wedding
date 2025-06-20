import { useEffect, useState, type ReactNode } from 'react';

type FadeInOnLoadProps = {
  children: ReactNode;
  className?: string;
};

export function FadeInOnLoad({ children, className = '' }: FadeInOnLoadProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-out
        ${show ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

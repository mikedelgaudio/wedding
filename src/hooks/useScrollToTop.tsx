import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // or 'smooth' if you want
    });
  }, [pathname]);

  return null;
}

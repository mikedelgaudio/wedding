import { useEffect } from 'react';

export function useTitle(titleOverride: string) {
  useEffect(() => {
    if (!titleOverride) {
      return;
    }

    const prevTitle = document.title;
    document.title = `${titleOverride} - Lynh Tran and Michael DelGaudio's Wedding Website`;
    return () => {
      document.title = prevTitle;
    };
  }, [titleOverride]);
}

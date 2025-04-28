import { useEffect } from 'preact/hooks';

export function useTitle(titleOverride: string) {
  useEffect(() => {
    if (!titleOverride) {
      return;
    }

    const prevTitle = document.title;
    document.title = titleOverride;
    return () => {
      document.title = prevTitle;
    };
  }, [titleOverride]);
}

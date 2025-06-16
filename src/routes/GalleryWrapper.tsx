import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { Gallery } from '../components/Gallery';

export function GalleryWrapper(): h.JSX.Element {
  const galleryProps = useMemo(() => {
    return {
      images: [
        { id: '1', src: '/images/1.jpg' },
        { id: '2', src: '/images/2.jpg' },
        { id: '3', src: '/images/3.jpg' },
        { id: '4', src: '/images/4.jpg' },
        { id: '5', src: '/images/5.jpg' },
        // { id: '6', src: '/images/gallery/6.jpg' },
        // { id: '7', src: '/images/gallery/7.jpg' },
        // { id: '8', src: '/images/gallery/8.jpg' },
        // { id: '9', src: '/images/gallery/9.jpg' },
        // { id: '10', src: '/images/gallery/10.jpg' },
      ],
      columnCount: 6,
      gap: 8,
      preloadCount: 10,
    };
  }, []);

  return <Gallery {...galleryProps} />;
}

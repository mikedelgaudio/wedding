import { h } from 'preact';
import img from '../assets/home.jpg';

export function Home(): h.JSX.Element {
  return (
    <div class="flex justify-center items-center">
      <div class={'w-full max-w-[2000px]'}>
        <div class="relative w-full aspect-video h-[calc(100dvh-200px)]">
          <img
            src={img}
            alt=""
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="async"
            class="w-full h-[inherit] object-cover object-top lg:object-center"
          />
        </div>
      </div>
    </div>
  );
}

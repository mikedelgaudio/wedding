import { h } from 'preact';
import img from '../assets/home.jpg';

export function Home(): h.JSX.Element {
  return (
    <div class="flex justify-center items-center">
      <div class="w-full max-w-[2000px]">
        <div class="relative w-full h-[calc(100dvh-194px)] overflow-hidden group">
          <img
            src={img}
            alt=""
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="async"
            class="
              absolute inset-0
              w-full h-full
              object-cover
              object-top sm:object-[50%_45%] md:object-[50%_42%] lg:object-[50%_40%]
              scale-100
              sm:scale-105
              lg:scale-110
              xl:scale-120
              max-w-none
              transition-transform
              duration-[2000ms]
              ease-out
              group-hover:scale-110
              sm:group-hover:scale-115
              lg:group-hover:scale-125
            "
          />
        </div>
      </div>
    </div>
  );
}

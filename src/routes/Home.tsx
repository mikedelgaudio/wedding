import type { JSX } from 'react';
import img from '../assets/home.jpg';

export function Home(): JSX.Element {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-[1000px]">
        <div className="relative w-full h-[calc(100dvh-132px)] lg:h-[calc(100dvh-164px)] overflow-hidden group">
          <img
            src={img}
            alt=""
            width="1920"
            height="1080"
            decoding="async"
            className="
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

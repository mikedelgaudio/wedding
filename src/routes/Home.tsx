import type { JSX } from 'react';
import img from '../assets/home.jpg';
import { FadeInOnLoad } from '../components/FadeInOnLoad';

export function Home(): JSX.Element {
  return (
    <FadeInOnLoad>
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
              motion-safe:transition-transform
              motion-safe:duration-[2000ms]
              motion-safe:ease-out
              motion-safe:group-hover:scale-110
              motion-safe:sm:group-hover:scale-115
              motion-safe:lg:group-hover:scale-125
            "
            />
          </div>
        </div>
      </div>
    </FadeInOnLoad>
  );
}

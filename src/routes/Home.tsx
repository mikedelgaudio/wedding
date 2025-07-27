import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppWithHeader } from '../AppWithHeader';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function Home(): JSX.Element {
  return (
    <AppWithHeader>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[1000px]">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[calc(100dvh-172px)] overflow-hidden group">
            <img
              src={`${CDN_URL}/home.jpg`}
              alt=""
              width="1920"
              height="1080"
              decoding="async"
              className="
              absolute inset-0
              w-full h-full
              object-cover
              object-[60%_27%] sm:object-[50%_45%] md:object-[50%_42%] lg:object-[50%_40%]
              scale-150
              sm:scale-125
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

          <div className="grid grid-cols-1 gap-6 md:justify-items-center py-6 pl-6">
            <div>
              <h1 className="text-7xl md:text-8xl font-bold md:hidden block">
                Lynh & Michael
              </h1>
              <div className="flex flex-nowrap whitespace-nowrap gap-4">
                <span className="text-2xl md:text-6xl">June 18, 2026</span>
                <span className="border-r border-gray-500">&nbsp;</span>
                <span className="text-2xl md:text-6xl">Redmond, WA</span>
              </div>
            </div>
            <Link
              className="text-xl md:text-2xl focus:outline-none w-fit px-6 py-2 focus:ring cursor-pointer bg-stone-900 text-white mr-8 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
              to={'/rsvp'}
            >
              RSVP
            </Link>
          </div>

          {/* <ScheduleCore /> */}
        </div>
      </div>
    </AppWithHeader>
  );
}

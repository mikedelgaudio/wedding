import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppWithHeader } from '../AppWithHeader';
import { AnimatedElement } from '../components/animation/AnimatedElement';
import { AutoScrollCarousel } from '../components/AutoScrollCarousel';
import { OurStoryCore } from '../components/OurStoryCore';
import { PageWrapper } from '../components/PageWrapper';
import { useEvent } from '../hooks/useEvent';

export function Home(): JSX.Element {
  const event = useEvent();

  return (
    <AppWithHeader>
      <div className="flex flex-col justify-center items-center">
        <AutoScrollCarousel />
        <div
          className="shadow-[inset_1px_26px_21px_0px_rgba(0,0,0,0.09)]
 w-full grid grid-cols-1 gap-6 md:justify-items-center py-20  px-2 bg-flax-smoke-500 text-white"
        >
          <div className="flex items-center justify-center flex-col">
            <AnimatedElement
              as="div"
              className="flex flex-col items-center"
              delay={0}
              duration={200}
              animationType="fade-up"
            >
              <p className="text-md md:text-xl uppercase pb-2">
                Please join us for the wedding of
              </p>
              <p
                className="text-6xl md:text-9xl"
                style={{ fontFamily: '"Tangerine", serif' }}
              >
                Lynh & Michael
              </p>
            </AnimatedElement>
            <AnimatedElement
              delay={100}
              duration={200}
              animationType="fade-up"
              className="flex flex-nowrap whitespace-nowrap gap-4 text-shadow-2xs mb-6"
            >
              <span className="text-2xl md:text-4xl">{event?.date}</span>
              <span className="border-r border-white">&nbsp;</span>
              <span className="text-2xl md:text-4xl">{event?.location}</span>
            </AnimatedElement>
            <Link
              className="text-xl md:text-4xl focus:outline-none w-fit px-6 py-2 focus:ring cursor-pointer shadow bg-stone-900 text-white rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
              to={'/rsvp'}
            >
              RSVP
            </Link>
          </div>
        </div>
        <PageWrapper>
          <OurStoryCore />
        </PageWrapper>
      </div>
    </AppWithHeader>
  );
}

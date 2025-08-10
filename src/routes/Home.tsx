import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppWithHeader } from '../AppWithHeader';
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
        <PageWrapper>
          <div className="grid grid-cols-1 gap-6 md:justify-items-center py-6">
            <div>
              <h1 className="text-7xl md:text-8xl font-bold md:hidden block">
                Lynh & Michael
              </h1>
              <div className="flex flex-nowrap whitespace-nowrap gap-4">
                <span className="text-2xl md:text-6xl">{event?.date}</span>
                <span className="border-r border-gray-500">&nbsp;</span>
                <span className="text-2xl md:text-6xl">{event?.location}</span>
              </div>
            </div>
            <Link
              className="text-xl md:text-2xl focus:outline-none w-fit px-6 py-2 focus:ring cursor-pointer bg-stone-900 text-white rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
              to={'/rsvp'}
            >
              RSVP
            </Link>
          </div>
          <OurStoryCore />
        </PageWrapper>
      </div>
    </AppWithHeader>
  );
}

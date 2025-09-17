import type { JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { AutoScrollCarousel } from '../components/AutoScrollCarousel';
import { OurStoryCore } from '../components/OurStoryCore';
import { PageWrapper } from '../components/PageWrapper';

export function Home(): JSX.Element {
  return (
    <AppWithHeader>
      <div className="flex flex-col justify-center items-center">
        <AutoScrollCarousel />
        <PageWrapper>
          <OurStoryCore />
        </PageWrapper>
      </div>
    </AppWithHeader>
  );
}

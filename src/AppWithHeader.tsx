import type { JSX } from 'react';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Footer } from './components/Footer';
import { Header3 } from './components/Header3';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header3 />
      <FadeInOnLoad>
        <main className="flex-grow">{children}</main>
      </FadeInOnLoad>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

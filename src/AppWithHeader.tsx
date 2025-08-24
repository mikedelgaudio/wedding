import type { JSX } from 'react';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FadeInOnLoad>
        <main className="mt-[72px] md:mt-auto flex-grow">{children}</main>
      </FadeInOnLoad>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

import type { JSX } from 'react';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Header } from './components/Header';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      <FadeInOnLoad>
        <main className="mt-[72px] md:mt-auto">{children}</main>
      </FadeInOnLoad>
    </>
  );
}

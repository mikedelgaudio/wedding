import type { JSX } from 'react';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Header } from './components/Header';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  return (
    <FadeInOnLoad>
      <Header />
      <main>{children}</main>
    </FadeInOnLoad>
  );
}

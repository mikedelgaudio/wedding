import type { JSX } from 'react';
import { useLocation } from 'react-router-dom';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Footer } from './components/Footer';
import { Header3 } from './components/Header3';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header3 />
      <FadeInOnLoad>
        <main
          className={`${!isHomePage ? 'mt-[72px] md:mt-[136px]' : 'mt-auto'}`}
        >
          {children}
        </main>
      </FadeInOnLoad>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

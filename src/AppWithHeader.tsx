import type { JSX } from 'react';
import { useLocation } from 'react-router-dom';
import { FadeInOnLoad } from './components/FadeInOnLoad';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function AppWithHeader({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FadeInOnLoad>
        <main
          className={`mt-auto ${!isHomePage ? 'pt-[72px] md:pt-0' : ''}`}
          id="main-content"
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

import Router, { Route } from 'preact-router';
import { Header } from './components/Header';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { GalleryWrapper } from './routes/GalleryWrapper';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';

export function App() {
  return (
    <div class={'bg-myColor-500'}>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/gallery" component={GalleryWrapper} />
          <Route path="/faq" component={FrequentlyAskedQuestions} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </div>
  );
}

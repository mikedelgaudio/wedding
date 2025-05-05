import Router, { Route } from 'preact-router';
import { Header } from './components/Header';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';

export function App() {
  return (
    <div class={'bg-myColor-500'}>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </div>
  );
}

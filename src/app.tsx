import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';

export function App() {
  return (
    <div className={'bg-myColor-500'}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Home />} />
          <Route path="/faq" element={<FrequentlyAskedQuestions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

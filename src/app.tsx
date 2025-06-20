import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';
import { OurStory } from './routes/OurStory';
import Schedule from './routes/Schedule';

export function App() {
  return (
    <div className={'bg-myColor-500'}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ourstory" element={<OurStory />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/faq" element={<FrequentlyAskedQuestions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

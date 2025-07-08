import { Route, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { Header } from './components/Header';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';
import { OurStory } from './routes/OurStory';
import { Rsvp } from './routes/Rsvp';
import { Schedule } from './routes/Schedule';

export function App() {
  return (
    <Fragment>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ourstory" element={<OurStory />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/rsvp" element={<Rsvp />} />
          <Route path="/faq" element={<FrequentlyAskedQuestions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Fragment>
  );
}

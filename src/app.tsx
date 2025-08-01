import { Outlet, Route, Routes } from 'react-router-dom';
import { EventProvider } from './context/event/EventProvider';
import { AuthProvider } from './firebase/auth/AuthProvider';
import { RequireAuth } from './firebase/auth/RequireAuth';
import { useScrollToTop } from './hooks/useScrollToTop';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import { Logout } from './routes/Logout';
import { NotFound } from './routes/NotFound';
import { OurStory } from './routes/OurStory';
import { Rsvp } from './routes/Rsvp';
import { Schedule } from './routes/Schedule';
import { Travel } from './routes/Travel';

// Layout component that provides EventProvider and RequireAuth for protected routes
function ProtectedLayout() {
  useScrollToTop();
  return (
    <EventProvider>
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    </EventProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="ourstory" element={<OurStory />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="rsvp" element={<Rsvp />} />
          <Route path="faq" element={<FrequentlyAskedQuestions />} />
          <Route path="travel" element={<Travel />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

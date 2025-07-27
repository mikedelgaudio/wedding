import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './firebase/auth/AuthProvider';
import { RequireAuth } from './firebase/auth/RequireAuth';
import { FrequentlyAskedQuestions } from './routes/FrequentlyAskedQuestions';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import { Logout } from './routes/Logout';
import { NotFound } from './routes/NotFound';
import { OurStory } from './routes/OurStory';
import { Rsvp } from './routes/Rsvp';
import { Schedule } from './routes/Schedule';
import { Travel } from './routes/Travel';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/ourstory"
          element={
            <RequireAuth>
              <OurStory />
            </RequireAuth>
          }
        />
        <Route
          path="/schedule"
          element={
            <RequireAuth>
              <Schedule />
            </RequireAuth>
          }
        />
        <Route
          path="/rsvp"
          element={
            <RequireAuth>
              <Rsvp />
            </RequireAuth>
          }
        />
        <Route
          path="/faq"
          element={
            <RequireAuth>
              <FrequentlyAskedQuestions />
            </RequireAuth>
          }
        />
        <Route
          path="/travel"
          element={
            <RequireAuth>
              <Travel />
            </RequireAuth>
          }
        />
        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

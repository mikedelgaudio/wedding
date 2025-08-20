import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tryPasswordLogin } from '../firebase/auth/tryPasswordLogin';
import { useAuth } from '../hooks/useAuth';
import {
  trackLoginFailed,
  trackLoginFormSubmit,
  trackLoginSuccess,
  trackPageView,
} from '../utils/analytics';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checking } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Track form submit button click
    trackLoginFormSubmit();

    const trimmedAndLoweredPassword = password.trim().toLowerCase();

    const result = await tryPasswordLogin(trimmedAndLoweredPassword);

    if (!result.success) {
      // Track login failure
      trackLoginFailed(result.error?.code, result.error?.message);

      setError(
        'The password entered may be invalid or an error occurred. Please try again by checking your password or refreshing the page.',
      );
      setSubmitting(false);
      return;
    }

    // Track successful login
    trackLoginSuccess();

    // If success, let useEffect redirect — no need to navigate manually
  }

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (!checking && user) {
      navigate(from, { replace: true });
    }
  }, [user, checking, navigate, from]);

  // Track page view and successful load
  useEffect(() => {
    trackPageView('/login');
  }, []);

  return (
    <div className="h-lvh grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 ">
      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="max-w-lg w-full">
          <h1 className="text-3xl font-bold">Welcome family and friends</h1>
          <p className="m-0">
            Please use the site password from your invitation to access the
            site.
          </p>
          <div className="flex items-center justify-between mt-4">
            <label htmlFor="site-password" className="text-lg font-bold">
              Site Password
            </label>
          </div>
          <div className="relative w-full">
            <input
              id="site-password"
              type={'text'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring"
              required
            />
            <p className="text-sm">
              Questions? Email us at{' '}
              <a
                className="underline focus:outline-none focus:ring hover:no-underline"
                href="mailto:wedding@delgaudio.dev"
              >
                wedding@delgaudio.dev
              </a>
              .
            </p>
          </div>
          {error && (
            <div className="bg-red-700 font-bold text-white my-2 p-4 rounded">
              <p id="rsvp-error" role="alert">
                {error}
              </p>
            </div>
          )}
          <button
            type="submit"
            className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white mt-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || checking || !!user}
          >
            {submitting || checking || !!user ? 'Checking...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="h-[calc(100vh-334px)] md:h-full w-full">
        <img
          src="https://cdn-wedding.delgaudio.dev/public-hero.jpg"
          alt=""
          className="object-cover w-full h-full"
          loading="eager"
        />
      </div>
    </div>
  );
}

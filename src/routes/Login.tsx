import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tryPasswordLogin } from '../firebase/auth/tryPasswordLogin';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checking } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const success = await tryPasswordLogin(password);

    if (!success) {
      setError(
        'The password entered may be invalid or an error occurred.Please try again by checking your password or refreshing the page.',
      );
      setSubmitting(false);
      return;
    }

    // If success, let useEffect redirect — no need to navigate manually
  }

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (!checking && user) {
      navigate(from, { replace: true });
    }
  }, [user, checking, navigate, from]);

  return (
    <div className="h-lvh grid grid-cols-1 md:grid-cols-2">
      <div className="h-full w-full">
        <img
          src="https://cdn-wedding.delgaudio.dev/ourstory.jpg"
          alt="Our Story"
          className="object-cover w-full h-full"
          loading="eager"
        />
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="max-w-lg w-full">
          <h1 className="text-2xl font-bold">Welcome family and friends</h1>
          <p className="m-0 text-gray-600">
            Please use the site password from your wedding invitation to access
            the site.
          </p>
          <div className="flex items-center justify-between mt-4">
            <label htmlFor="site-password" className="text-lg font-bold">
              Site Password
            </label>
            <p className="text-sm">
              Questions?{' '}
              <a
                className="underline focus:outline-none focus:ring hover:no-underline"
                href="mailto:rsvp@delgaudio.dev"
              >
                Contact us
              </a>
            </p>
          </div>
          <div className="relative w-full">
            <input
              id="site-password"
              type={showPassword ? 'text' : 'text'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-sm text-black-600 hover:underline focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p role="alert" className="text-red-500 my-3">
              {error}
            </p>
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
    </div>
  );
}

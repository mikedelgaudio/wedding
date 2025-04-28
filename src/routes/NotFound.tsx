import { h } from 'preact';
import { Link } from 'preact-router';
import { useTitle } from '../hooks/useTitle';

export function NotFound(): h.JSX.Element {
  useTitle('404 Not Found');

  return (
    <div class={'grid'}>
      <h1 class={'text-3xl font-bold'}>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link class={'underline hover:no-underline mt-5'} href="/">
        Go Home
      </Link>
    </div>
  );
}

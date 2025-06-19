import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';

export function NotFound(): JSX.Element {
  useTitle('Not Found');

  return (
    <div className="flex justify-center">
      <div className="max-w-[1000px] w-full flex-col flex">
        <h1 className={'text-3xl font-bold'}>404 - Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link className={'underline hover:no-underline mt-5'} to="/">
          Go Home
        </Link>
      </div>
    </div>
  );
}

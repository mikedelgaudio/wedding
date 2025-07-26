import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { useTitle } from '../hooks/useTitle';

export function NotFound(): JSX.Element {
  useTitle('Not Found');

  return (
    <PageWrapper pageTitle="Page Not Found">
      <div className="flex justify-center">
        <div className="max-w-[1000px] w-full flex-col flex">
          <p className="text-xl">
            Sorry, the page you are looking for does not exist. Please try
            checking the URL or navigating to a different page.
          </p>
          <Link className={'text-xl underline hover:no-underline mt-5'} to="/">
            Go Back to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}

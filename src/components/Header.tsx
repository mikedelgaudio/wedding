import { h } from 'preact';
import { Link } from 'preact-router';

export function Header(): h.JSX.Element {
  return (
    <header class={'flex items-center justify-center py-4 flex-col gap-10'}>
      <div class={'flex items-center justify-center'}>
        <span class={'text-7xl leading-tight'}>Lynh & Michael</span>
      </div>
      <nav>
        <ul class={'flex space-x-4'}>
          <li>
            <Link href="/" class={'hover:underline'}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/" class={'hover:underline'}>
              Schedule
            </Link>
          </li>
          <li>
            <Link href="/" class={'hover:underline'}>
              Registry
            </Link>
          </li>
          <li>
            <Link href="/" class={'hover:underline'}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/" class={'hover:underline'}>
              RSVP
            </Link>
          </li>
          <li>
            <Link href="/" class={'hover:underline'}>
              FAQ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

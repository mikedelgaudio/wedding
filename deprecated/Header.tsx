import { useCallback, useEffect, useState, type JSX } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useEvent } from '../src/hooks/useEvent';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/travel', label: 'Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/faq', label: 'FAQ' },
];

export function Header(): JSX.Element {
  const event = useEvent();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen(open => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="relative z-50">
      <header className="flex items-center w-full px-6 md:pt-6 md:pb-4 py-4 max-w-5xl mx-auto z-50 bg-fantasy-50 fixed top-0 left-0 md:relative">
        <button
          className="md:hidden cursor-pointer md:invisible flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {[
            'rotate-45 translate-y-2',
            'opacity-0',
            '-rotate-45 -translate-y-2',
          ].map((transform, i) => (
            <span
              key={i}
              className={`block h-0.5 w-8 bg-black transition-all duration-300 ${
                menuOpen ? transform : ''
              }`}
            />
          ))}
        </button>

        <div className="flex justify-center w-full flex-wrap">
          <Link
            className="flex font-bold focus-visible:outline focus-visible:outline-gray-950 md:text-6xl text-4xl w-full justify-center"
            style={{ fontFamily: 'Tangerine' }}
            to="/"
          >
            🌷 Lynh & Michael 🌷
          </Link>
          <span className="md:block hidden text-lg">
            {event?.date} &nbsp;&middot;&nbsp; {event?.location}
          </span>
        </div>
      </header>
      <div
        className={`fixed inset-0 top-[72px] flex flex-col items-center bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav
          className={`w-full bg-fantasy-50 overflow-hidden transition-transform transform origin-top duration-500 ease-in-out ${
            menuOpen ? 'scale-y-100' : 'scale-y-0'
          } flex flex-col items-center justify-start gap-10 pb-6`}
          style={{
            transformOrigin: 'top',
            transform: `translateY(${menuOpen ? '0' : '-100%'})`, // Ensures smooth roll-up animation
            transition: 'transform 0.5s ease-in-out',
          }}
          onClick={e => e.stopPropagation()}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={label}
              to={href}
              className={({ isActive }) =>
                `hover:overline text-xl ${isActive ? 'font-bold overline' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center gap-15 text-2xl pb-4">
        {NAV_LINKS.map(({ href, label }) => (
          <NavLink
            key={label}
            to={href}
            className={({ isActive }) =>
              `focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6 hover:overline text-xl ${
                isActive ? 'font-bold overline' : ''
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

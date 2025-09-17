import { useCallback, useEffect, useState, type JSX } from 'react';
import { Link, NavLink } from 'react-router-dom';
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/travel', label: 'Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/faq', label: 'FAQ' },
];

export function Header3(): JSX.Element {
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
      {/* Single backdrop blur container that expands when menu is open */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          menuOpen
            ? 'bg-black/50 backdrop-blur-sm'
            : 'bg-transparent pointer-events-none'
        }`}
      >
        {/* Fixed hamburger button */}
        <button
          className="fixed top-4 left-6 md:hidden pointer-events-auto cursor-pointer z-60 flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6"
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
              className={`block h-0.5 w-8 bg-white transition-all duration-300 ${
                menuOpen ? transform : ''
              }`}
            />
          ))}
        </button>

        <header className="flex flex-col items-center w-full px-6 py-4 mx-auto text-white">
          <div className="flex justify-center w-full">
            <Link
              className={`${
                menuOpen ? 'opacity-100 flex' : 'opacity-0 hidden'
              } font-bold pointer-events-auto focus-visible:outline focus-visible:outline-gray-950 md:text-6xl text-4xl w-full justify-center mb-4 md:mb-0`}
              style={{ fontFamily: 'Tangerine' }}
              to="/"
            >
              Lynh & Michael
            </Link>
          </div>

          {/* Single navigation that transforms between desktop and mobile layouts */}
          <nav
            className={`
              transition-all duration-500 ease-in-out text-white pointer-events-auto
              ${
                menuOpen
                  ? 'flex flex-col items-center justify-start gap-10 w-full pt-4 md:flex md:items-center md:justify-center md:gap-15 md:text-2xl md:pt-0'
                  : 'hidden md:flex md:items-center md:justify-center md:gap-15 md:text-2xl'
              }
            `}
            onClick={menuOpen ? e => e.stopPropagation() : undefined}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink
                key={label}
                to={href}
                className={({ isActive }) =>
                  `cursor-pointer focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6 hover:overline text-xl transition-colors ${
                    isActive ? 'font-bold overline' : ''
                  }`
                }
                onClick={menuOpen ? closeMenu : undefined}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
      </div>
    </div>
  );
}

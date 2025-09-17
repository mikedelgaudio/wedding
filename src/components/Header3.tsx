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
      <header
        className={`flex items-center w-full px-6 py-4 mx-auto z-50 text-white pointer-events-none fixed top-0 left-0 ${
          menuOpen ? 'bg-black/50' : 'bg-transparent'
        }`}
      >
        <button
          className="md:hidden pointer-events-auto cursor-pointer md:invisible flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6"
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

        <div className="flex justify-center w-full flex-wrap">
          <Link
            className={`${
              menuOpen ? 'opacity-100 flex' : 'opacity-0 hidden'
            } font-bold focus-visible:outline focus-visible:outline-gray-950 md:text-6xl text-4xl w-full justify-center  `}
            style={{ fontFamily: 'Tangerine' }}
            to="/"
          >
            Lynh & Michael
          </Link>
          <nav className="hidden md:flex items-center justify-center gap-15 text-2xl">
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
      </header>
      <div
        className={`fixed inset-0 top-[72px] flex flex-col items-center bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav
          className={`w-full text-white overflow-hidden transition-transform transform origin-top duration-500 ease-in-out ${
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
    </div>
  );
}

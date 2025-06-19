import { useCallback, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/registry', label: 'Registry' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/faq', label: 'FAQ' },
];

export function Header(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen(open => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="relative z-50">
      {/* Sticky Header */}
      <header className="flex items-center w-full px-6 py-4 max-w-5xl mx-auto z-50 relative">
        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
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

        {/* Title */}
        <Link
          className="text-5xl sm:text-7xl leading-25 w-full flex justify-center"
          style={{ fontFamily: 'BickhamScriptPro' }}
          to="/"
        >
          Lynh & Michael
        </Link>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 flex flex-col items-center bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dropdown Nav with offset for header height */}
        <nav
          className={`bg-white w-full overflow-hidden transition-transform transform origin-top duration-500 ease-in-out ${
            menuOpen ? 'scale-y-100' : 'scale-y-0'
          } flex flex-col items-center justify-start gap-10 py-10`}
          style={{
            transformOrigin: 'top',
            transform: `translateY(${menuOpen ? '0' : '-100%'})`, // Ensures smooth roll-up animation
            transition: 'transform 0.5s ease-in-out',
          }}
          onClick={e => e.stopPropagation()}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              to={href}
              className="text-3xl hover:underline"
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center gap-15 text-2xl pb-4">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={label} to={href} className="hover:underline">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

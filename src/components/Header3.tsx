import { useCallback, useEffect, useState, type JSX } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/travel', label: 'Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/faq', label: 'FAQ' },
];

export function Header3(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = useCallback(() => setMenuOpen(open => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Handle scroll detection
  useEffect(() => {
    if (!isHomePage) return; // Only apply scroll detection on home page

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

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
      {/* Header background - only covers header area */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          menuOpen
            ? 'bg-transparent md:bg-black/80 md:backdrop-blur-md'
            : isHomePage
            ? isScrolled
              ? 'bg-fantasy-50/80 backdrop-blur-md'
              : 'bg-transparent'
            : 'bg-fantasy-50/80 backdrop-blur-md'
        }`}
      >
        <header
          className={`flex flex-col items-center w-full py-4 mx-auto transition-colors duration-200 ${
            menuOpen || (isHomePage && !isScrolled)
              ? 'text-white'
              : 'text-black'
          }`}
        >
          <div className="flex justify-center w-full">
            <Link
              className={`${
                menuOpen || !isHomePage
                  ? 'opacity-100 flex'
                  : isHomePage && isScrolled
                  ? 'opacity-100 flex md:opacity-0 md:hidden'
                  : 'opacity-0 md:opacity-0 md:hidden'
              } font-bold pointer-events-auto focus-visible:outline focus-visible:outline-gray-950 md:text-6xl text-4xl w-full justify-center mb-0 md:pb-4`}
              style={{ fontFamily: 'Tangerine' }}
              to="/"
              onClick={menuOpen ? closeMenu : undefined}
            >
              Lynh & Michael
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className={`
              transition-all duration-200 ease-in-out ${
                menuOpen || (isHomePage && !isScrolled)
                  ? 'text-white'
                  : 'text-black'
              } pointer-events-auto
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

      {/* Fixed hamburger button - outside backdrop to maintain z-index */}
      <button
        className="fixed top-3 left-3 md:hidden pointer-events-auto cursor-pointer z-60 flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus-visible:outline focus-visible:outline-gray-950 focus-visible:outline-offset-6"
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
            className={`block h-0.5 w-8 ${
              menuOpen || (isHomePage && !isScrolled) ? 'bg-white' : 'bg-black'
            } transition-all duration-300 ${menuOpen ? transform : ''}`}
          />
        ))}
      </button>

      {/* Mobile menu backdrop - full screen when open */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen
            ? 'bg-black/50 backdrop-blur-sm'
            : 'bg-transparent pointer-events-none'
        }`}
      ></div>
    </div>
  );
}

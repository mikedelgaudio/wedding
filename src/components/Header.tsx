import { h } from 'preact';
import { Link } from 'preact-router';
import { useCallback, useState } from 'preact/hooks';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/', label: 'Schedule' },
  { href: '/', label: 'Registry' },
  { href: '/', label: 'Gallery' },
  { href: '/', label: 'RSVP' },
  { href: '/', label: 'FAQ' },
];

export function Header(): h.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen(open => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div class="relative z-50">
      {/* Sticky Header */}
      <header class="flex items-center w-full px-6 py-4 max-w-5xl mx-auto z-50 relative">
        {/* Hamburger button */}
        <button
          class="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
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
              class={`block h-0.5 w-8 bg-black transition-all duration-300 ${
                menuOpen ? transform : ''
              }`}
            />
          ))}
        </button>

        {/* Title */}
        <span
          class="font-bickham text-5xl md:text-7xl lg:text-9xl leading-tight w-full flex justify-center"
          style={{ fontFamily: 'BickhamScriptPro' }}
        >
          Lynh & Michael
        </span>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        class={`fixed inset-0 flex flex-col items-center bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dropdown Nav with offset for header height */}
        <nav
          class={`bg-white w-full overflow-hidden transition-transform transform origin-top duration-500 ease-in-out ${
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
              href={href}
              class="text-3xl hover:underline"
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Navigation */}
      <nav class="hidden md:flex items-center justify-center gap-8 text-2xl my-6">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={label} href={href} class="hover:underline">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

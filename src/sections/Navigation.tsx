import React, { useRef, useLayoutEffect, useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { scrollToSection as scrollToAnchor } from '../lib/scrollToSection';
import { PulseLogo } from '@/components/PulseLogo';

const Navigation: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Method', href: '#method' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Results', href: '#results' },
  ];

  useLayoutEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const goTo = (href: string) => {
    scrollToAnchor(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full section-padding">
          <div className="flex items-center justify-between">
            <a
              href="#main-content"
              aria-label="Pulse — Home"
              className="flex items-center gap-2 rounded-lg group outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <PulseLogo
                priority
                className="h-8 md:h-9"
                alt="Pulse"
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/login"
                className="text-sm font-medium text-stone-400 hover:text-stone-100 transition-colors rounded-md px-1 py-1 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
              >
                Log in
              </Link>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => goTo(link.href)}
                  className="text-sm font-medium text-stone-400 hover:text-stone-100 transition-colors relative group rounded-md px-1 py-1 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full" aria-hidden />
                </button>
              ))}
            </div>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => goTo('#pricing')}
                className="btn-primary text-sm min-h-[44px] min-w-[44px] px-5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                Start Training
              </button>
            </div>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-stone-100 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden />
              ) : (
                <Menu className="w-6 h-6" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        id={mobileMenuId}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          tabIndex={isMobileMenuOpen ? 0 : -1}
          aria-label="Close menu"
          className="absolute inset-0 bg-neutral-950/95 backdrop-blur-2xl cursor-default"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <button
                key={link.label}
                type="button"
                tabIndex={isMobileMenuOpen ? 0 : -1}
                onClick={() => goTo(link.href)}
                className="text-2xl font-bold text-stone-100 hover:text-emerald-400 transition-colors min-h-[44px] rounded-lg px-4 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/login"
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-stone-400 hover:text-emerald-400 transition-colors min-h-[44px] rounded-lg px-4 py-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            >
              Log in
            </Link>
            <button
              type="button"
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onClick={() => goTo('#pricing')}
              className="btn-primary mt-4 min-h-[44px] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              Start Training
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;

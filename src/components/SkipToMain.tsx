import { scrollToSection } from '../lib/scrollToSection';

/** WCAG 2.4.1 — keyboard users skip past nav/noise to primary content */
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:w-auto focus:overflow-visible focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-3 focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection('#main-content');
        requestAnimationFrame(() => {
          document.getElementById('main-content')?.focus({ preventScroll: true });
        });
      }}
    >
      Skip to main content
    </a>
  );
}

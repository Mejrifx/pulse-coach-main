/** Jump to an in-page hash; uses CSS `scroll-margin` on `#main-content` / `main section[id]` for the fixed nav. */
export function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (!(el instanceof HTMLElement)) return;
  el.scrollIntoView({ block: 'start', behavior: 'instant' });
}

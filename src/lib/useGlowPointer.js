/**
 * Global spotlight pointer tracker.
 * Sets --glow-x, --glow-y, --glow-xp, --glow-yp on :root so
 * every [data-glow] card responds to the same mouse — no per-card listeners.
 * Using CSS custom properties on :root with background-attachment: fixed
 * ensures the gradient origin is always the actual cursor position on-screen.
 */
export function initGlowPointer() {
  const root = document.documentElement;

  const sync = (e) => {
    root.style.setProperty('--glow-x',  e.clientX + 'px');
    root.style.setProperty('--glow-y',  e.clientY + 'px');
    root.style.setProperty('--glow-xp', (e.clientX / window.innerWidth).toFixed(4));
    root.style.setProperty('--glow-yp', (e.clientY / window.innerHeight).toFixed(4));
  };

  document.addEventListener('pointermove', sync, { passive: true });
  return () => document.removeEventListener('pointermove', sync);
}

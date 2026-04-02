/**
 * Global spotlight pointer tracker + per-card fade management.
 *
 * Two separate jobs:
 *   1. Track the global mouse position as CSS vars on :root so
 *      every [data-glow] card sees the same cursor coordinates.
 *
 *   2. For each [data-glow] card, manage a CSS class "glow-active"
 *      that drives opacity transitions.
 *      - mouseenter  → add "glow-active" immediately (fast fade IN)
 *      - mouseleave  → remove "glow-active" after FADE_OUT_MS delay
 *        so the glow lingers longer before disappearing.
 *
 * WHY JS instead of CSS :hover?
 *   CSS removes :hover immediately when the pointer leaves, which
 *   collapses pseudo-element transitions instantly. JS lets us delay
 *   the class removal so the CSS transition actually plays through.
 */

const FADE_OUT_MS = 700; // how long the glow lingers after mouse leaves

export function initGlowPointer() {
  const root = document.documentElement;

  // ── 1. Global pointer coordinates ────────────────────────
  const syncCoords = (e) => {
    root.style.setProperty('--glow-x',  e.clientX + 'px');
    root.style.setProperty('--glow-y',  e.clientY + 'px');
    root.style.setProperty('--glow-xp', (e.clientX / window.innerWidth).toFixed(4));
    root.style.setProperty('--glow-yp', (e.clientY / window.innerHeight).toFixed(4));
  };
  document.addEventListener('pointermove', syncCoords, { passive: true });

  // ── 2. Per-card enter/leave with delayed fade-out ─────────
  const leaveTimers = new WeakMap();

  const onEnter = (e) => {
    const card = e.currentTarget;
    // Cancel any pending fade-out on this card
    const pending = leaveTimers.get(card);
    if (pending) clearTimeout(pending);
    card.classList.add('glow-active');
  };

  const onLeave = (e) => {
    const card = e.currentTarget;
    // Delay the class removal so the CSS transition finishes
    const t = setTimeout(() => {
      card.classList.remove('glow-active');
    }, FADE_OUT_MS);
    leaveTimers.set(card, t);
  };

  // Attach to existing cards, plus watch for future ones (React mounts async)
  const attachTo = (card) => {
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
  };

  const detachFrom = (card) => {
    card.removeEventListener('mouseenter', onEnter);
    card.removeEventListener('mouseleave', onLeave);
  };

  // Handle cards already in the DOM
  document.querySelectorAll('[data-glow]').forEach(attachTo);

  // Handle cards added later (React hydration / lazy mounts)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches('[data-glow]')) attachTo(node);
        node.querySelectorAll('[data-glow]').forEach(attachTo);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Cleanup function (called if needed)
  return () => {
    document.removeEventListener('pointermove', syncCoords);
    document.querySelectorAll('[data-glow]').forEach(detachFrom);
    observer.disconnect();
  };
}

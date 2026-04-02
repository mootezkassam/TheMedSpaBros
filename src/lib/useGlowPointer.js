/**
 * Spotlight glow pointer tracker.
 *
 * Uses LOCAL card coordinates (mouse pos relative to each card's bounding box)
 * instead of global viewport coords + background-attachment:fixed.
 *
 * This avoids the "wrong corner lights up" bug that occurs when:
 *   - background-attachment:fixed maps coords in viewport space
 *   - the gradient can bleed into unexpected card edges when the
 *     cursor exits fast and the last coord is far outside the card
 *
 * Strategy:
 *   - pointermove → set --card-x / --card-y on EVERY [data-glow] card
 *     (each card gets the mouse position relative to its own origin)
 *   - mouseenter → add .glow-active immediately (fast fade IN)
 *   - mouseleave → remove .glow-active after FADE_MS (so CSS transition plays)
 */

const FADE_MS = 100; // ms the glow lingers after mouse leaves

export function initGlowPointer() {
  // Live set of all [data-glow] cards on the page
  const cards = new Set();

  const register = (el) => {
    if (el.matches('[data-glow]')) cards.add(el);
    el.querySelectorAll('[data-glow]').forEach((c) => cards.add(c));
  };

  // Seed with cards already in DOM
  register(document.body);

  // Watch for React-mounted cards added later
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (n instanceof Element) register(n);
      })
    );
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Per-card local coordinates on every move ──────────────────
  const leaveTimers = new WeakMap();

  const onMove = (e) => {
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--card-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--card-y', (e.clientY - r.top)  + 'px');
    });
  };

  // ── Enter: show glow immediately ──────────────────────────────
  const onEnter = function () {
    const pending = leaveTimers.get(this);
    if (pending) clearTimeout(pending);
    this.classList.add('glow-active');
  };

  // ── Leave: hold then remove ───────────────────────────────────
  const onLeave = function () {
    const t = setTimeout(() => this.classList.remove('glow-active'), FADE_MS);
    leaveTimers.set(this, t);
  };

  const attach = (card) => {
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
  };

  cards.forEach(attach);

  // Attach to any card added after the initial seed
  const origObserverCallback = observer.takeRecords; // keep reference
  const attachObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches('[data-glow]')) { cards.add(n); attach(n); }
        n.querySelectorAll('[data-glow]').forEach((c) => { cards.add(c); attach(c); });
      })
    );
  });
  attachObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('pointermove', onMove, { passive: true });

  return () => {
    document.removeEventListener('pointermove', onMove);
    observer.disconnect();
    attachObserver.disconnect();
  };
}

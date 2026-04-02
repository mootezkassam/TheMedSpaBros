/**
 * Spotlight glow pointer tracker.
 *
 * INJECTION STRATEGY:
 *   Injects a <span class="glow-ring"> as the FIRST child of every [data-glow]
 *   card. The glow ::before / ::after live on THIS span, not on the card itself,
 *   so they can never conflict with the card's own existing pseudo-elements.
 *
 *   The span is:
 *     - position: absolute; inset: 0 (covers full card face)
 *     - pointer-events: none (invisible to mouse)
 *     - z-index: 100 (above card content, but masked to border strip only)
 *
 * COORDINATES:
 *   Uses LOCAL card coordinates (--card-x / --card-y relative to each card's
 *   bounding box) instead of viewport-space globals.
 *   This prevents the "wrong corner lights up" bug from background-attachment:fixed.
 *
 * FADE:
 *   - mouseenter → .glow-active added instantly (fast fade IN)
 *   - mouseleave → .glow-active removed after FADE_MS (CSS transition plays out)
 */

const FADE_MS = 100;

function injectRing(card) {
  // Avoid double-injecting
  if (card.querySelector(':scope > .glow-ring')) return;
  const ring = document.createElement('span');
  ring.className = 'glow-ring';
  ring.setAttribute('aria-hidden', 'true');
  card.insertBefore(ring, card.firstChild);
}

export function initGlowPointer() {
  const cards = new Set();
  const leaveTimers = new WeakMap();

  const register = (el) => {
    if (el.matches?.('[data-glow]')) {
      cards.add(el);
      injectRing(el);
    }
    el.querySelectorAll?.('[data-glow]').forEach((c) => {
      cards.add(c);
      injectRing(c);
    });
  };

  // Seed existing cards
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

  // ── Per-card local coordinates ─────────────────────────────────
  const onMove = (e) => {
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--card-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--card-y', (e.clientY - r.top) + 'px');
    });
  };

  // ── Enter: show glow immediately ───────────────────────────────
  const onEnter = function () {
    const pending = leaveTimers.get(this);
    if (pending) clearTimeout(pending);
    this.classList.add('glow-active');
  };

  // ── Leave: hold FADE_MS then remove ───────────────────────────
  const onLeave = function () {
    const t = setTimeout(() => this.classList.remove('glow-active'), FADE_MS);
    leaveTimers.set(this, t);
  };

  const attach = (card) => {
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
  };
  cards.forEach(attach);

  // Attach listeners to newly added cards
  const attachObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches('[data-glow]')) { cards.add(n); injectRing(n); attach(n); }
        n.querySelectorAll('[data-glow]').forEach((c) => { cards.add(c); injectRing(c); attach(c); });
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

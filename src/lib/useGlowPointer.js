/**
 * Spotlight glow — pointer tracker + .glow-ring injector
 *
 * 1. Injects <span class="glow-ring" aria-hidden="true"> into every [data-glow]
 *    card so the border glow lives on a DEDICATED element whose ::before/::after
 *    can never conflict with the card's own existing pseudo-elements.
 *
 * 2. On every pointermove, writes --card-x / --card-y as the mouse position
 *    RELATIVE to each card's own top-left corner (not viewport coords).
 *    This means moving outside a card pushes the gradient off its edge → no
 *    corner bleed artifacts.
 *
 * 3. mouseenter  → adds  .glow-active immediately   (fast fade IN)
 *    mouseleave  → removes .glow-active after 100ms  (CSS transition plays out)
 */

const FADE_MS = 100;

function injectRing(card) {
  if (card.querySelector(':scope > .glow-ring')) return;
  const ring = document.createElement('span');
  ring.className = 'glow-ring';
  ring.setAttribute('aria-hidden', 'true');
  card.insertBefore(ring, card.firstChild);
}

export function initGlowPointer() {
  const cards = new Set();
  const leaveTimers = new WeakMap();

  /** Register a card: inject ring + attach listeners */
  const register = (card) => {
    if (cards.has(card)) return;
    cards.add(card);
    injectRing(card);

    card.addEventListener('mouseenter', function () {
      const t = leaveTimers.get(this);
      if (t) clearTimeout(t);
      this.classList.add('glow-active');
    });

    card.addEventListener('mouseleave', function () {
      const el = this;
      const t = setTimeout(() => el.classList.remove('glow-active'), FADE_MS);
      leaveTimers.set(el, t);
    });
  };

  /** Scan an element and its subtree for [data-glow] cards */
  const scan = (root) => {
    if (root.matches?.('[data-glow]')) register(root);
    root.querySelectorAll?.('[data-glow]').forEach(register);
  };

  // Seed with cards already in DOM
  scan(document.body);

  // Watch for cards added later (React async renders)
  const mo = new MutationObserver((mutations) =>
    mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n instanceof Element) scan(n);
    }))
  );
  mo.observe(document.body, { childList: true, subtree: true });

  // Update local coords on every mouse move
  document.addEventListener('pointermove', (e) => {
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--card-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--card-y', (e.clientY - r.top)  + 'px');
    });
  }, { passive: true });

  return () => mo.disconnect();
}

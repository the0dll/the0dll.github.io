/* ==========================================================================
   Page Transitions: Pixel Grid Wipe & Smooth Navigation
   Handles cinematic grid transition overlay and custom ease scrolling for anchor links
   ========================================================================== */

class PageTransition {
  constructor() {
    this.overlay = null;
    this.panels = [];
    this.pendingHref = null;
    this.isAnimating = false;

    this._buildDOM();
    this._bindLinks();
    this._revealIn();
  }

  // --- Build Grid Overlay DOM ---
  _buildDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'pt-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const cell = Math.max(56, Math.round(window.innerWidth / 18));
    this.cols = Math.ceil(window.innerWidth / cell);
    this.rows = Math.ceil(window.innerHeight / cell);
    overlay.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    overlay.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    for (let i = 0; i < this.cols * this.rows; i++) {
      const b = document.createElement('div');
      b.className = 'pt-block' + (Math.random() < 0.07 ? ' is-accent' : '');
      overlay.appendChild(b);
      this.panels.push(b);
    }

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  // --- Link Interception & Navigation Handling ---
  _bindLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Smooth scroll for hash / anchor links
      if (href.startsWith('#')) {
        if (e.defaultPrevented) return;
        if (link.id === 'link-contacts' && !link.classList.contains('is-active')) return;
        const targetId = href.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;
        e.preventDefault();
        this._smoothScrollTo(target);
        history.replaceState(null, '', href);
        return;
      }

      // Ignore external or non-HTTP links
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http') ||
        link.target === '_blank'
      ) return;

      // Ignore links to current page
      try {
        const targetUrl = new URL(link.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        const cleanPath = (p) => {
          let s = p.replace(/\\/g, '/').toLowerCase();
          s = s.replace(/\/index\.html$/, '');
          s = s.replace(/\/+$/, '');
          return s;
        };

        if (
          targetUrl.origin === currentUrl.origin &&
          cleanPath(targetUrl.pathname) === cleanPath(currentUrl.pathname) &&
          (!targetUrl.hash || targetUrl.hash === currentUrl.hash)
        ) {
          e.preventDefault();
          return;
        }
      } catch (_) {}

      // Internal page navigation with pixel wipe
      e.preventDefault();
      if (this.isAnimating) return;
      this.pendingHref = href;
      this._sweepIn();
    });
  }

  // --- Custom Cubic Eased Smooth Scrolling ---
  _smoothScrollTo(target) {
    if (this._scrollFrame) cancelAnimationFrame(this._scrollFrame);
    const startY = window.scrollY || window.pageYOffset;
    const targetY = Math.max(0, target.getBoundingClientRect().top + startY);
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = Math.min(1450, Math.max(820, Math.abs(distance) * 1.05));
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const frame = now => {
      const t = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, startY + distance * ease(t));
      if (t < 1) this._scrollFrame = requestAnimationFrame(frame);
      else this._scrollFrame = null;
    };
    this._scrollFrame = requestAnimationFrame(frame);
  }

  // --- Random Delay Generator for Pixel Grid ---
  _scatter(spread) {
    this.panels.forEach(b => { b.style.transitionDelay = `${Math.round(Math.random() * spread)}ms`; });
  }

  // --- Page Exit Animation: Blocks sweep in ---
  _sweepIn() {
    this.isAnimating = true;
    this.overlay.classList.add('is-active');
    this._scatter(420);
    this.panels.forEach(b => b.classList.add('is-in'));
    setTimeout(() => { window.location.href = this.pendingHref; }, 520);
  }

  // --- Page Enter Animation: Blocks sweep out ---
  _revealIn() {
    this.overlay.classList.add('is-active');
    this.panels.forEach(b => {
      b.style.transitionDelay = '0ms';
      b.classList.add('is-in');
    });
    void this.overlay.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this._scatter(480);
      this.panels.forEach(b => b.classList.remove('is-in'));
      setTimeout(() => {
        this.overlay.classList.remove('is-active');
        this.isAnimating = false;
      }, 560);
    }));
  }
}

// --- Initialize Page Transition on Load ---
document.addEventListener('DOMContentLoaded', () => {
  window._pageTransition = new PageTransition();
});

// --- Restored from back/forward cache (mobile browsers): clear the wipe overlay ---
window.addEventListener('pageshow', (e) => {
  const pt = window._pageTransition;
  if (!e.persisted || !pt) return;
  pt.panels.forEach(b => { b.style.transitionDelay = '0ms'; b.classList.remove('is-in'); });
  pt.overlay.classList.remove('is-active');
  pt.isAnimating = false;
  pt.pendingHref = null;
});

/**
 * the0dll' — Cinematic 3-Panel Page Transition
 * Three black panels sweep in → cover screen → sweep out on every navigation.
 * Feels premium, choreographed, expensive.
 */

class PageTransition {
  constructor() {
    this.overlay = null;
    this.panels = [];
    this.pendingHref = null;
    this.isAnimating = false;

    this._buildDOM();
    this._bindLinks();
    this._revealIn(); // On page load — panels sweep OUT revealing the page
  }

  _buildDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'pt-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 3; i++) {
      const panel = document.createElement('div');
      panel.className = 'pt-panel';
      panel.dataset.index = i;
      overlay.appendChild(panel);
      this.panels.push(panel);
    }

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  _bindLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http') ||
        link.target === '_blank'
      ) return;

      e.preventDefault();
      if (this.isAnimating) return;
      this.pendingHref = href;
      this._sweepIn();
    });
  }

  // Panels sweep IN -> cover screen -> navigate
  _sweepIn() {
    this.isAnimating = true;
    this.overlay.classList.add('is-active');

    this.panels.forEach((panel, i) => {
      panel.style.transitionDelay = `${i * 90}ms`;
      panel.classList.add('is-in');
    });

    const totalDuration = 620 + 2 * 90;
    setTimeout(() => {
      window.location.href = this.pendingHref;
    }, totalDuration);
  }

  // Panels sweep OUT -> reveal new page
  _revealIn() {
    this.overlay.classList.add('is-active');
    this.panels.forEach(panel => {
      panel.classList.add('is-in');
      panel.style.transitionDelay = '0ms';
      panel.style.transition = 'none';
    });

    void this.overlay.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.panels.forEach((panel, i) => {
          panel.style.transition = '';
          panel.style.transitionDelay = `${i * 90}ms`;
          panel.classList.remove('is-in');
        });

        const totalOut = 720 + 2 * 90;
        setTimeout(() => {
          this.overlay.classList.remove('is-active');
          this.isAnimating = false;
        }, totalOut);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window._pageTransition = new PageTransition();
});

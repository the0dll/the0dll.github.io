
/* ==========================================================================
   0. Mobile Navigation Menu
   Toggles the full-screen menu panel (<= 720px); closes on link tap, Escape,
   outside resize, and restores focus to the toggle.
   ========================================================================== */
class MobileNav {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.toggle = document.getElementById('nav-toggle');
    this.menu = document.getElementById('site-menu');
    if (!this.header || !this.toggle || !this.menu) return;
    this.mq = window.matchMedia('(max-width: 720px)');
    this.isOpen = false;

    this.toggle.addEventListener('click', () => this.set(!this.isOpen));
    this.menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) this.set(false, false);
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.set(false);
    });
    const onChange = () => { if (!this.mq.matches && this.isOpen) this.set(false, false); };
    if (this.mq.addEventListener) this.mq.addEventListener('change', onChange);
    else if (this.mq.addListener) this.mq.addListener(onChange);
    window.addEventListener('langchange', () => this.syncLabel());
    window.addEventListener('pageshow', () => { if (this.isOpen) this.set(false, false); });
    this.markCurrent();
    this.set(false, false);
  }

  markCurrent() {
    const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    this.menu.querySelectorAll('.nav-link').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (href && href === file) a.setAttribute('aria-current', 'page');
    });
  }

  syncLabel() {
    const key = this.isOpen ? 'nav.close' : 'nav.menu';
    const label = window.I18N ? window.I18N.t(key) : (this.isOpen ? 'Close menu' : 'Menu');
    this.toggle.setAttribute('aria-label', label);
    this.toggle.setAttribute('data-i18n-aria', key);
  }

  set(open, restoreFocus = true) {
    this.isOpen = open;
    this.header.classList.toggle('is-menu-open', open);
    document.documentElement.classList.toggle('nav-open', open);
    this.toggle.setAttribute('aria-expanded', String(open));
    this.syncLabel();
    // Keep the hidden panel out of the tab order / a11y tree on mobile
    const hidden = this.mq.matches && !open;
    if (hidden) this.menu.setAttribute('aria-hidden', 'true'); else this.menu.removeAttribute('aria-hidden');
    if ('inert' in this.menu) this.menu.inert = hidden;
    if (!open && restoreFocus && this.mq.matches) this.toggle.focus();
  }
}

/* ==========================================================================
   1. Scroll Progress Bar Director
   Tracks window scroll position and scales top progress bar
   ========================================================================== */
class ScrollProgressDirector {
  constructor() {
    this.bar = document.getElementById('scroll-progress-bar');
    if (!this.bar) return;

    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll);
    this.onScroll();
  }

  onScroll() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
    this.bar.style.transform = `scaleX(${progress.toFixed(4)})`;
  }
}

/* ==========================================================================
   2. TextScramble Algorithm (Local Fallback)
   Progressive text glitch decoder
   ========================================================================== */
class TextScramble {
  constructor(el) {
    if (window.TextScramble && this.constructor !== window.TextScramble) {
    }
    this._impl = window.TextScramble ? null : null;
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#01XYZabcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
    this.frameRequest = null;
    this.frame = 0;
    this.resolve = null;
    this.running = false;
  }
  setText(newText) {
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    const target = String(newText || '');
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, target.length);
    const promise = new Promise((resolve) => { this.resolve = resolve; });
    this.queue = [];
    this.running = true;
    let nonSpaceSeen = 0;
    for (let i = 0; i < length; i++) {
      const to = target[i] || '';
      if (to === ' ' || to === '') {
        this.queue.push({ to: to || ' ', start: 0, end: 0 });
        continue;
      }
      nonSpaceSeen++;
      if (nonSpaceSeen <= 2) {
        this.queue.push({ to, start: 0, end: 0 });
        continue;
      }
      const wave = nonSpaceSeen - 3;
      const start = 2 + wave * 5;
      const end = start + 18 + Math.floor(Math.random() * 10);
      this.queue.push({ to, start, end, char: this.chars[Math.floor(Math.random() * this.chars.length)] });
    }
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      const { to, start, end } = item;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (Math.random() < 0.55) item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        output += item.char;
      } else {
        if (start === 0) { output += to; complete++; }
        else {
          if (Math.random() < 0.4) item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
          output += item.char || this.chars[0];
        }
      }
    }
    this.el.textContent = output;
    if (complete === this.queue.length) {
      this.el.textContent = this.queue.map(q => q.to).join('');
      this.running = false;
      if (this.resolve) this.resolve();
      this.resolve = null;
      return;
    }
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }
}

/* ==========================================================================
   3. Home Page Scroll Choreographer
   Drives sticky viewport transitions: media box scaling, 2x2 text grid,
   dashed divider animations, and smooth scrolling to contacts
   ========================================================================== */
class HomeScrollDirector {
  constructor() {
    this.track = document.getElementById('scroll-track');
    this.mediaBox = document.getElementById('animated-media');
    this.dividerV = document.getElementById('divider-v');
    this.dividerH = document.getElementById('divider-h');
    this.caption = document.getElementById('media-caption');

    this.innerWorks = document.getElementById('inner-works');
    this.innerContacts = document.getElementById('inner-contacts');
    this.innerThe0dll = document.getElementById('inner-the0dll');

    this.linkWorks = document.getElementById('link-works');
    this.linkContacts = document.getElementById('link-contacts');
    this.linkThe0dll = document.getElementById('link-the0dll');

    if (!this.track || !this.mediaBox) return;

    this.targetProgress = 0;
    this.currentProgress = 0;
    this.lerpFactor = 0.12;

    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll, { passive: true });

    [this.linkWorks, this.linkContacts, this.linkThe0dll].forEach(link => {
      if (!link) return;
      const inner = link.querySelector('.text-inner');
      if (!inner) return;
      const scrambler = new TextScramble(inner);
      let isBusy = false;

      link.addEventListener('mouseenter', () => {
        if (isBusy) return;
        isBusy = true;
        const key = inner.getAttribute('data-i18n');
        const target = (key && window.I18N)
          ? window.I18N.t(key)
          : inner.innerText.trim();
        scrambler.setText(target).then(() => {
          isBusy = false;
        });
      });
    });

    const scrollToContacts = (contactsSec) => {
      const startY = window.scrollY;
      const targetY = Math.max(0, contactsSec.getBoundingClientRect().top + window.scrollY);
      const distance = targetY - startY;
      const duration = Math.min(1200, Math.max(720, Math.abs(distance) * 1.15));
      const startTime = performance.now();
      const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const frame = now => {
        const t = Math.min(1, (now - startTime) / duration);
        window.scrollTo(0, startY + distance * ease(t));
        if (t < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    if (this.linkContacts) {
      this.linkContacts.addEventListener('click', (e) => {
        if (!this.linkContacts.classList.contains('is-active')) return;
        e.preventDefault();
        const contactsSec = document.getElementById('contacts');
        if (contactsSec) {
          history.replaceState(null, '', '#contacts');
          scrollToContacts(contactsSec);
        }
      });
    }

    const scrollToContactsHash = () => {
      if (window.location.hash === '#contacts') {
        const contactsSec = document.getElementById('contacts');
        if (contactsSec) {
          scrollToContacts(contactsSec);
        }
      }
    };
    window.addEventListener('hashchange', scrollToContactsHash);
    if (window.location.hash === '#contacts') {
      setTimeout(scrollToContactsHash, 150);
    }

    this.onScroll();
    requestAnimationFrame(this.update);
  }

  onResize() {
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    // Landscape phones (short viewport) keep the 2x2 desktop-style stage
    this.isCompact = this.winH <= 520 && this.winW > this.winH;
    this.isMobile = this.winW <= 900 && !this.isCompact;

    if (this.isMobile) {
      this.finalW = this.winW - 40;
      this.finalH = Math.round(this.finalW * (9 / 16));
      this.finalX = 20;
      this.finalY = Math.round(this.winH * 0.54);
    } else {
      this.finalW = Math.min(this.winW * 0.44, 680);
      this.finalH = Math.round(this.finalW * (9 / 16));
      this.finalX = Math.round(this.winW * 0.50 + 32);
      this.finalY = Math.round(this.winH * 0.50 + 24);
      if (this.isCompact) {
        const room = Math.max(60, this.winH - this.finalY - 56);
        if (this.finalH > room) {
          this.finalH = Math.round(room);
          this.finalW = Math.round(room * (16 / 9));
        }
      }
    }

    this.maxScroll = this.track.offsetHeight - this.winH;
  }

  onScroll() {
    if (!this.maxScroll || this.maxScroll <= 0) {
      this.maxScroll = this.track.offsetHeight - this.winH;
    }
    const scrollY = window.scrollY || window.pageYOffset;
    this.targetProgress = Math.min(Math.max(scrollY / this.maxScroll, 0), 1);
  }

  ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  clamp(val, min = 0, max = 1) {
    return Math.min(Math.max(val, min), max);
  }

  update() {
    this.currentProgress += (this.targetProgress - this.currentProgress) * this.lerpFactor;
    const p = this.currentProgress;

    const mediaP = this.ease(this.clamp(p / 0.72));
    const curX = 0 + (this.finalX - 0) * mediaP;
    const curY = 0 + (this.finalY - 0) * mediaP;
    const curW = this.winW + (this.finalW - this.winW) * mediaP;
    const curH = this.winH + (this.finalH - this.winH) * mediaP;
    const curR = 4 * mediaP;

    this.mediaBox.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;
    this.mediaBox.style.width = `${curW.toFixed(1)}px`;
    this.mediaBox.style.height = `${curH.toFixed(1)}px`;
    this.mediaBox.style.borderRadius = `${curR.toFixed(1)}px`;

    if (this.caption) {
      const capTop = curY + curH + 12;
      this.caption.style.transform = `translate3d(${curX.toFixed(1)}px, ${capTop.toFixed(1)}px, 0)`;
      const capP = this.clamp((p - 0.70) / 0.25);
      this.caption.style.opacity = capP.toFixed(2);
    }

    if (this.innerThe0dll) {
      const the0dllP = this.ease(this.clamp((p - 0.18) / 0.45));
      const transY = (115 * (1 - the0dllP)).toFixed(2);
      this.innerThe0dll.style.transform = `translateY(${transY}%)`;

      if (this.linkThe0dll) {
        this.linkThe0dll.classList.toggle('is-active', the0dllP > 0.02);
        this.linkThe0dll.classList.toggle('is-revealed', the0dllP >= 0.98);
      }
    }

    if (this.dividerV && !this.isMobile) {
      const divVP = this.clamp((p - 0.38) / 0.40);
      this.dividerV.style.transform = `scaleY(${divVP.toFixed(3)})`;
    }

    if (this.dividerH && !this.isMobile) {
      const divHP = this.clamp((p - 0.52) / 0.32);
      this.dividerH.style.transform = `scaleX(${divHP.toFixed(3)})`;
    }

    if (this.innerWorks) {
      const worksP = this.ease(this.clamp((p - 0.52) / 0.40));
      const transY = (115 * (1 - worksP)).toFixed(2);
      this.innerWorks.style.transform = `translateY(${transY}%)`;

      if (this.linkWorks) {
        this.linkWorks.classList.toggle('is-active', worksP > 0.13);
        this.linkWorks.classList.toggle('is-revealed', worksP >= 0.98);
      }
    }

    if (this.innerContacts) {
      const contactsP = this.ease(this.clamp((p - 0.58) / 0.40));
      const transY = (115 * (1 - contactsP)).toFixed(2);
      this.innerContacts.style.transform = `translateY(${transY}%)`;

      if (this.linkContacts) {
        this.linkContacts.classList.toggle('is-active', contactsP > 0.13);
        this.linkContacts.classList.toggle('is-revealed', contactsP >= 0.98);
      }
    }

    requestAnimationFrame(this.update);
  }
}

/* ==========================================================================
   4. Featured Coverflow Carousel Controller (Skins 01–06)
   3D looping carousel with swipe, drag, keyboard arrows, and infinite loop diff
   ========================================================================== */
class WorksCoverflowController {
  constructor() {
    this.viewport = document.getElementById('carousel-viewport');
    this.cards = document.querySelectorAll('.carousel-card');
    this.prevBtn = document.getElementById('carousel-prev');
    this.nextBtn = document.getElementById('carousel-next');
    this.counterEl = document.getElementById('carousel-counter');
    this.tagEl = document.getElementById('active-skin-tag');

    if (!this.viewport || this.cards.length === 0) return;

    this.currentIndex = 0;
    this.total = this.cards.length;

    this.init();
  }

  init() {
    this.updateCards();

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    this.dragged = false;
    this.cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (this.dragged) return;
        if (this.currentIndex !== idx) {
          this.goTo(idx);
        } else if (window.worksLightbox) {
          const title = document.getElementById('active-skin-title')?.textContent || '';
          const tag = `[ ${String(idx + 1).padStart(2, '0')} / ${String(this.total).padStart(2, '0')} ]`;
          window.worksLightbox.open(card.querySelector('img'), title, tag);
        }
      });
    });

    let touchStartX = 0;
    this.viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.viewport.addEventListener('touchend', (e) => {
      this.handleSwipe(touchStartX, e.changedTouches[0].screenX);
    }, { passive: true });

    let isMouseDown = false;
    let mouseStartX = 0;
    this.viewport.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });
    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.dragged = Math.abs(e.clientX - mouseStartX) > 6;
      this.handleSwipe(mouseStartX, e.clientX);
      setTimeout(() => (this.dragged = false), 0);
    });

    window.addEventListener('keydown', (e) => {
      const rect = this.viewport.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
    });
  }

  handleSwipe(start, end) {
    if (Math.abs(end - start) > 45) {
      end > start ? this.prev() : this.next();
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.total) % this.total;
    this.updateCards();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.total;
    this.updateCards();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updateCards();
  }

  wrappedDiff(idx) {
    let d = idx - this.currentIndex;
    const half = this.total / 2;
    if (d > half) d -= this.total;
    if (d < -half) d += this.total;
    return d;
  }

  updateCards() {
    this.cards.forEach((card, idx) => {
      const d = this.wrappedDiff(idx);

      if (d === 0) {
        card.setAttribute('data-pos', '0');
      } else if (d === -1) {
        card.setAttribute('data-pos', '-1');
      } else if (d === 1) {
        card.setAttribute('data-pos', '1');
      } else if (d === -2) {
        card.setAttribute('data-pos', '-2');
      } else if (d === 2) {
        card.setAttribute('data-pos', '2');
      } else if (d < -2) {
        card.setAttribute('data-pos', 'hidden-left');
      } else {
        card.setAttribute('data-pos', 'hidden-right');
      }
    });

    if (this.tagEl) {
      const cur = String(this.currentIndex + 1).padStart(2, '0');
      const tot = String(this.total).padStart(2, '0');
      this.tagEl.style.opacity = '0';
      setTimeout(() => {
        this.tagEl.textContent = `[ ${cur} / ${tot} ]`;
        this.tagEl.style.opacity = '1';
      }, 160);
    }

    if (this.counterEl) {
      const cur = String(this.currentIndex + 1).padStart(2, '0');
      const tot = String(this.total).padStart(2, '0');
      this.counterEl.textContent = `${cur} / ${tot}`;
    }
  }
}

/* ==========================================================================
   5. Stream Archive Grid Scroll Observer
   Fade-in entrance observer for skins 07–42
   ========================================================================== */
class StreamArchiveObserver {
  constructor() {
    this.cards = document.querySelectorAll('.stream-card');
    if (this.cards.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.cards.forEach(card => this.observer.observe(card));
  }
}

/* ==========================================================================
   6. Live Timecode Display
   Russian: YEKT clock. English: visitor's local time in 12-hour format.
   ========================================================================== */
function updateLocalTime() {
  const el = document.getElementById('local-time');
  if (!el) return;
  const lang = window.I18N ? window.I18N.getLang() : (document.documentElement.lang || 'en');
  const now = new Date();
  if (lang === 'ru') {
    const hms = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Yekaterinburg', hour12: false,
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(now);
    el.textContent = `YEKT ${hms.replace(/^24/, '00')}`;
  } else {
    const localTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    }).format(now);
    el.textContent = `LOCAL ${localTime}`;
  }
}

setInterval(updateLocalTime, 1000);
window.addEventListener('langchange', updateLocalTime);
updateLocalTime();


/* ==========================================================================
   7. DOMContentLoaded Main Initializer
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MobileNav === 'function') new MobileNav();
  if (typeof ScrollProgressDirector === 'function') new ScrollProgressDirector();
  if (typeof HomeScrollDirector === 'function') new HomeScrollDirector();
  if (typeof WorksCoverflowController === 'function') new WorksCoverflowController();
  if (typeof StreamArchiveObserver === 'function') new StreamArchiveObserver();

  const brandLogo = document.querySelector('.brand-logo');
  const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
  if (brandLogo && (path.endsWith('/index.html') || path.endsWith('/web/') || path.endsWith('/web') || path === '/')) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
});

/**
 * the0dll' Portfolio — Cinematic Scroll Director, Coverflow Carousel & Stream Archive
 */

// Scroll Progress Bar Controller
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

// Kinetic Text Scramble Effect for Hover (as in tddsash) — slow & smooth
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#_0101XYZabcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 16);   // ← было 8, теперь 16
      const end = start + Math.floor(Math.random() * 22) + 10; // ← было 12, теперь 22–32
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.14) {  // ← было 0.28, теперь реже меняется
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity: 0.6;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Scroll Director for Home Page
class TddsashScrollDirector {
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

    // Attach scramble effect to stage links (works even when partially emerged)
    [this.linkWorks, this.linkContacts, this.linkThe0dll].forEach(link => {
      if (!link) return;
      const inner = link.querySelector('.text-inner');
      if (!inner) return;
      const originalText = inner.innerText.trim();
      const scrambler = new TextScramble(inner);
      let isBusy = false;

      link.addEventListener('mouseenter', () => {
        if (isBusy) return;
        isBusy = true;
        scrambler.setText(originalText).then(() => {
          isBusy = false;
        });
      });
    });

    // Smooth scroll down to black contacts section when clicking contacts
    if (this.linkContacts) {
      this.linkContacts.addEventListener('click', (e) => {
        e.preventDefault();
        const contactsSec = document.getElementById('contacts');
        if (contactsSec) {
          contactsSec.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    }

    // Scroll to contacts if URL contains #contacts
    const scrollToContactsHash = () => {
      if (window.location.hash === '#contacts') {
        const contactsSec = document.getElementById('contacts');
        if (contactsSec) {
          contactsSec.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    this.isMobile = this.winW <= 900;

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

    // 1. Media Box Scaling (p = 0.0 to p = 0.72)
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

    // Docked Caption under the media box
    if (this.caption) {
      const capTop = curY + curH + 12;
      this.caption.style.transform = `translate3d(${curX.toFixed(1)}px, ${capTop.toFixed(1)}px, 0)`;
      const capP = this.clamp((p - 0.70) / 0.25);
      this.caption.style.opacity = capP.toFixed(2);
    }

    // 2. The0dll unmasking (p = 0.18 to 0.65)
    if (this.innerThe0dll) {
      const the0dllP = this.ease(this.clamp((p - 0.18) / 0.45));
      const transY = (115 * (1 - the0dllP)).toFixed(2);
      this.innerThe0dll.style.transform = `translateY(${transY}%)`;

      if (this.linkThe0dll) {
        this.linkThe0dll.classList.toggle('is-active', the0dllP > 0.02);
        this.linkThe0dll.classList.toggle('is-revealed', the0dllP >= 0.98);
      }
    }

    // 3. Vertical Dashed Divider (Top half only, p = 0.38 to 0.78)
    if (this.dividerV && !this.isMobile) {
      const divVP = this.clamp((p - 0.38) / 0.40);
      this.dividerV.style.transform = `scaleY(${divVP.toFixed(3)})`;
    }

    // 4. Horizontal Dashed Divider (Above media, p = 0.52 to 0.85)
    if (this.dividerH && !this.isMobile) {
      const divHP = this.clamp((p - 0.52) / 0.32);
      this.dividerH.style.transform = `scaleX(${divHP.toFixed(3)})`;
    }

    // 5. Works & Contacts unmasking (p = 0.52 to 0.95)
    if (this.innerWorks) {
      const worksP = this.ease(this.clamp((p - 0.52) / 0.40));
      const transY = (115 * (1 - worksP)).toFixed(2);
      this.innerWorks.style.transform = `translateY(${transY}%)`;

      if (this.linkWorks) {
        this.linkWorks.classList.toggle('is-active', worksP > 0.02);
        this.linkWorks.classList.toggle('is-revealed', worksP >= 0.98);
      }
    }

    if (this.innerContacts) {
      const contactsP = this.ease(this.clamp((p - 0.58) / 0.40));
      const transY = (115 * (1 - contactsP)).toFixed(2);
      this.innerContacts.style.transform = `translateY(${transY}%)`;

      if (this.linkContacts) {
        this.linkContacts.classList.toggle('is-active', contactsP > 0.02);
        this.linkContacts.classList.toggle('is-revealed', contactsP >= 0.98);
      }
    }

    requestAnimationFrame(this.update);
  }
}

// Infinite Loop Coverflow Carousel — fishermen order by Toolki (Skins 1–6)
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
    this.total = this.cards.length; // 6

    this.init();
  }

  init() {
    this.updateCards();

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    // Клик по соседней карточке — переход к ней
    this.dragged = false;
    this.cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (this.dragged) return;
        if (this.currentIndex !== idx) {
          this.goTo(idx);
        } else if (window.worksLightbox) {
          // клик по центральной — открыть на весь экран с отступами
          const title = document.getElementById('active-skin-title')?.textContent || '';
          const tag = `[ ${String(idx + 1).padStart(2, '0')} / ${String(this.total).padStart(2, '0')} ]`;
          window.worksLightbox.open(card.querySelector('img'), title, tag);
        }
      });
    });

    // Touch Swipe
    let touchStartX = 0;
    this.viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.viewport.addEventListener('touchend', (e) => {
      this.handleSwipe(touchStartX, e.changedTouches[0].screenX);
    }, { passive: true });

    // Mouse Drag
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

    // Keyboard
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

  // Вычисляет «кратчайший» diff с учётом цикличности
  // Позволяет карусели идти через 0 вперёд и назад бесшовно
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

    // Обновить счётчик позиции в теге
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

// Stream Archive Intersection Observer (Skins 7 to 15)
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

// Live Moscow Timecode (MSK HH:MM:SS)
function updateMoscowTime() {
  const el = document.getElementById('msk-time');
  if (el) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const msk = new Date(utc + (3600000 * 3));
    const h = String(msk.getHours()).padStart(2, '0');
    const m = String(msk.getMinutes()).padStart(2, '0');
    const s = String(msk.getSeconds()).padStart(2, '0');
    el.textContent = `MSK ${h}:${m}:${s}`;
  }
}

setInterval(updateMoscowTime, 1000);
updateMoscowTime();

// Language Switcher
function toggleLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollProgressDirector();
  new TddsashScrollDirector();
  new WorksCoverflowController();
  new StreamArchiveObserver();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleLang(btn.dataset.lang));
  });
});

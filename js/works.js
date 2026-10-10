
/* ==========================================================================
   Works Page: Dynamic Masonry Layout & Fullscreen Lightbox
   Distributes cards by aspect ratio and manages expanding image gallery modal
   ========================================================================== */

// --- Masonry Grid: Multi-column stream distributor ---
class MasonryGrid {
  constructor(container) {
    this.container = container;
    this.cards = Array.from(container.querySelectorAll('.stream-card'));
    if (!this.cards.length) return;

    this.cols = 0;
    this.layout();
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => this.layout(), 120);
    });
  }

  // Column count per screen breakpoint (1 col <= 640px, 2 col <= 1000px, 3 col desktop)
  columnCount() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1000) return 2;
    return 3;
  }

  ratio(card) {
    const img = card.querySelector('img');
    const w = img.getAttribute('width') || img.naturalWidth || 1;
    const h = img.getAttribute('height') || img.naturalHeight || 1;
    return h / w;
  }

  // Distribute cards into shortest column
  layout() {
    const n = this.columnCount();
    if (n === this.cols) return;
    this.cols = n;

    this.container.innerHTML = '';
    const columns = Array.from({ length: n }, () => {
      const col = document.createElement('div');
      col.className = 'stream-col';
      this.container.appendChild(col);
      return { el: col, h: 0 };
    });

    this.cards.forEach((card, i) => {
      const shortest = columns.reduce((a, b) => (b.h < a.h ? b : a));
      shortest.el.appendChild(card);
      shortest.h += this.ratio(card);
      card.style.setProperty('--d', `${(i % n) * 90}ms`);
    });
  }
}

// --- Lightbox Modal: Interactive image viewer with FLIP transitions ---
class Lightbox {
  constructor() {
    this.isOpen = false;
    this.isAnimating = false;
    this.build();
    this.bind();
  }

  build() {
    this.root = document.createElement('div');
    this.root.className = 'lightbox';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button type="button" class="lightbox-close" aria-label="Close">[ close ]</button>
      <button type="button" class="lightbox-nav-btn lightbox-prev" aria-label="Previous image">←</button>
      <button type="button" class="lightbox-nav-btn lightbox-next" aria-label="Next image">→</button>
      <img class="lightbox-img" alt="">
      <div class="lightbox-caption"></div>`;
    document.body.appendChild(this.root);

    this.backdrop = this.root.querySelector('.lightbox-backdrop');
    this.closeBtn = this.root.querySelector('.lightbox-close');
    this.prevBtn = this.root.querySelector('.lightbox-nav-btn.lightbox-prev');
    this.nextBtn = this.root.querySelector('.lightbox-nav-btn.lightbox-next');
    this.img = this.root.querySelector('.lightbox-img');
    this.captionEl = this.root.querySelector('.lightbox-caption');

    this.applyLanguage = () => {
      if (!window.I18N) return;
      const closeLabel = window.I18N.t('works.close');
      this.closeBtn.setAttribute('aria-label', closeLabel);
      this.closeBtn.textContent = `[ ${closeLabel.toLowerCase()} ]`;
      this.prevBtn.setAttribute('aria-label', window.I18N.t('works.prev_image'));
      this.nextBtn.setAttribute('aria-label', window.I18N.t('works.next_image'));
    };
    window.addEventListener('langchange', this.applyLanguage);
    this.applyLanguage();
  }

  bind() {
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });
    this.backdrop.addEventListener('click', () => this.close());
    this.img.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // Touch: horizontal swipe flips through gallery images
    let swipeX = 0, swipeY = 0;
    this.root.addEventListener('touchstart', (e) => {
      swipeX = e.changedTouches[0].clientX;
      swipeY = e.changedTouches[0].clientY;
    }, { passive: true });
    this.root.addEventListener('touchend', (e) => {
      if (!this.isOpen) return;
      const dx = e.changedTouches[0].clientX - swipeX;
      const dy = e.changedTouches[0].clientY - swipeY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        dx > 0 ? this.prev() : this.next();
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.prev();
      else if (e.key === 'ArrowRight') this.next();
    });

    window.addEventListener('resize', () => {
      if (this.isOpen) {
        const r = this.targetRect();
        this.applyRect(r, false);
        this.placeCaption(r);
      }
    });

    document.querySelectorAll('.stream-card').forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('.stream-title')?.textContent || '';
        const tag = card.querySelector('.stream-tag')?.textContent || '';
        let gallery = [];
        const raw = card.getAttribute('data-gallery');
        if (raw) {
          try {
            gallery = JSON.parse(raw);
          } catch (_) {
            gallery = raw.split(',').map(s => s.trim());
          }
        }
        this.open(img, title, tag, gallery);
      });
    });
  }

  targetRect() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const padX = vw <= 640 ? 20 : Math.max(48, vw * 0.07);
    const padTop = vw <= 640 ? 84 : 80;
    const padBottom = vw <= 640 ? 96 : 96;
    const nw = this.nw || 1, nh = this.nh || 1;
    const scale = Math.min((vw - padX * 2) / nw, (vh - padTop - padBottom) / nh);
    const w = nw * scale, h = nh * scale;
    return {
      left: (vw - w) / 2,
      top: padTop + (vh - padTop - padBottom - h) / 2,
      width: w,
      height: h,
    };
  }

  applyRect(r, animate = true) {
    const s = this.img.style;
    if (animate) {
      s.transition = 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1), width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      s.transition = 'none';
    }
    s.left = r.left + 'px';
    s.top = r.top + 'px';
    s.width = r.width + 'px';
    s.height = r.height + 'px';
  }

  placeCaption(r) {
    this.captionEl.style.left = r.left + 'px';
    this.captionEl.style.top = (r.top + r.height + 16) + 'px';
  }

  open(sourceImg, title, tag, gallery = []) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.isAnimating = true;
    clearTimeout(this.closeTimer);
    clearTimeout(this.badgeReturnTimer);
    document.body.style.overflow = 'hidden';

    this.source = sourceImg;
    sourceImg.style.opacity = '';
    this.title = title;
    this.tag = tag;
    this.gallery = (Array.isArray(gallery) && gallery.length) ? gallery : [sourceImg.currentSrc || sourceImg.src];
    this.currentIndex = 0;

    this.nw = sourceImg.naturalWidth || +sourceImg.getAttribute('width') || 1;
    this.nh = sourceImg.naturalHeight || +sourceImg.getAttribute('height') || 1;

    this.img.src = this.gallery[0];
    this.img.style.transform = 'none';
    this.updateCaption();

    const startRect = sourceImg.getBoundingClientRect();
    this.applyRect(startRect, false);
    this.img.style.opacity = '1';
    this.img.getBoundingClientRect();

    sourceImg.style.visibility = 'hidden';

    // fade out gallery badge on the card
    const card = sourceImg.closest('.stream-card');
    this.activeBadge = card ? card.querySelector('.stream-gallery-badge') : null;
    if (this.activeBadge) {
      this.activeBadge.classList.remove('is-returning');
      this.activeBadge.classList.add('is-hidden');
    }

    this.root.classList.remove('is-closing');
    this.root.classList.add('is-open');
    if (this.gallery.length > 1) {
      this.root.classList.add('has-multiple');
    } else {
      this.root.classList.remove('has-multiple');
    }
    this.root.setAttribute('aria-hidden', 'false');

    const target = this.targetRect();
    this.placeCaption(target);
    requestAnimationFrame(() => {
      this.applyRect(target, true);
      setTimeout(() => {
        this.isAnimating = false;
      }, 520);
    });
  }

  updateCaption() {
    const parts = [this.title, this.tag.replace(/[\[\]]/g, '').trim()];
    if (this.gallery.length > 1) {
      parts.push(`[ ${this.currentIndex + 1} / ${this.gallery.length} ]`);
    }
    this.captionEl.textContent = parts.filter(Boolean).join(' · ');
  }

  prev() {
    if (!this.isOpen || this.gallery.length <= 1 || this.isAnimating) return;
    this.currentIndex = (this.currentIndex - 1 + this.gallery.length) % this.gallery.length;
    this.switchImage(-1);
  }

  next() {
    if (!this.isOpen || this.gallery.length <= 1 || this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.gallery.length;
    this.switchImage(1);
  }

  switchImage(dir = 1) {
    this.isAnimating = true;
    const nextSrc = this.gallery[this.currentIndex];

    this.img.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.26s ease';
    this.img.style.transform = `translateX(${-dir * 45}px) scale(0.96)`;
    this.img.style.opacity = '0';
    this.captionEl.style.opacity = '0.3';

    const temp = new Image();
    temp.src = nextSrc;
    temp.onload = () => {
      setTimeout(() => {
        if (!this.isOpen) return;

        this.nw = temp.naturalWidth || this.nw;
        this.nh = temp.naturalHeight || this.nh;
        this.img.src = nextSrc;

        const target = this.targetRect();
        this.applyRect(target, false);
        this.img.style.transform = `translateX(${dir * 45}px) scale(0.96)`;
        this.img.style.opacity = '0';
        this.img.getBoundingClientRect();

        this.placeCaption(target);
        this.updateCaption();

        requestAnimationFrame(() => {
          this.img.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.38s ease, left 0.42s cubic-bezier(0.16, 1, 0.3, 1), top 0.42s cubic-bezier(0.16, 1, 0.3, 1), width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
          this.img.style.transform = 'translateX(0) scale(1)';
          this.img.style.opacity = '1';
          this.captionEl.style.opacity = '1';

          setTimeout(() => {
            this.isAnimating = false;
          }, 450);
        });
      }, 50);
    };
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.isAnimating = true;
    this.root.setAttribute('aria-hidden', 'true');

    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing');

    if (this.source && this.gallery.length > 1) {
      this.source.src = this.gallery[this.currentIndex];
    }

    if (this.source) {
      const sourceRect = this.source.getBoundingClientRect();
      this.img.style.transform = 'none';
      this.applyRect(sourceRect, true);
      this.img.style.transition = 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1), width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';
      this.img.style.opacity = '0';
      this.source.style.visibility = '';
      this.source.style.opacity = '0';
      requestAnimationFrame(() => {
        if (!this.isOpen && this.source) this.source.style.opacity = '1';
      });
    } else {
      this.img.style.opacity = '0';
    }

    // fade badge back in as lightbox closes
    if (this.activeBadge) {
      const badge = this.activeBadge;
      badge.classList.add('is-returning');
      this.activeBadge.classList.remove('is-hidden');
      this.badgeReturnTimer = setTimeout(() => {
        badge.classList.remove('is-returning');
      }, 550);
    }

    this.closeTimer = setTimeout(() => {
      this.root.classList.remove('is-closing');
      this.root.classList.remove('has-multiple');
      this.img.style.opacity = '0';
      this.img.style.transform = 'none';
      this.applyRect({ left: 0, top: 0, width: 0, height: 0 }, false);
      if (this.source) {
        this.source.style.visibility = '';
        this.source.style.opacity = '';
      }
      this.activeBadge = null;
      document.body.style.overflow = '';
      this.isAnimating = false;
    }, 500);
  }
}

// --- Gallery folder badges on multi-image cards ---
function injectGalleryBadges() {
  document.querySelectorAll('.stream-card[data-gallery]').forEach((card) => {
    if (card.querySelector('.stream-gallery-badge')) return;

    let gallery = [];
    const raw = card.getAttribute('data-gallery');
    try {
      gallery = JSON.parse(raw);
    } catch (_) {
      gallery = raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(gallery) || gallery.length < 2) return;

    const media = card.querySelector('.stream-media-box');
    if (!media) return;

    const badge = document.createElement('div');
    badge.className = 'stream-gallery-badge';
    badge.setAttribute('aria-label', `${gallery.length} images`);
    badge.innerHTML = `
      <div class="badge-face">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1.5 4h4.2l1.3 1.7H14.5v7.3H1.5V4z" stroke="#0c0c0c" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="gallery-count">${gallery.length}</span>
    `;
    media.appendChild(badge);
  });
}

// --- Initialize Masonry and Lightbox on Load ---
window.addEventListener('DOMContentLoaded', () => {
  injectGalleryBadges();
  const grid = document.querySelector('.stream-grid');
  if (grid) new MasonryGrid(grid);
  window.worksLightbox = new Lightbox();
});

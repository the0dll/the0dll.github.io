
/* ==========================================================================
   About Page Interactive Choreography
   Unified 'about' runner, typewriter bio, pinned process collage,
   word-by-word blur manifesto, and specializing wipe bars
   ========================================================================== */

(() => {
  'use strict';

  /* ==========================================================================
     1. TextScramble Fallback Engine
     Left-to-right progressive character scramble with preserved spaces
     ========================================================================== */
  class FallbackTextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#_0101XYZabcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
    this.frameRequest = null;
    this.frame = 0;
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const isRussian = /[А-Яа-яЁё]/.test(newText);
    const promise = new Promise((resolve) => { this.resolve = resolve; });
    this.queue = [];

    let protectLeft = 2;
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      if (to === ' ' || from === ' ') {
        this.queue.push({ from, to, start: 0, end: 0, char: to });
        continue;
      }
      if (protectLeft > 0 && to) {
        protectLeft--;
        this.queue.push({ from, to, start: 0, end: 0, char: to });
        continue;
      }
      const start = Math.floor(Math.random() * 14) + 4;
      const base = 42 + Math.min(36, Math.floor(i * 1.2)) + Math.floor(Math.random() * 18);
      const end = start + Math.round(base * (isRussian ? 1.15 : 1));
      this.queue.push({ from, to, start, end, char: from || this.randomChar() });
    }

    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      const { from, to, start, end } = item;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (to === ' ') {
          complete++;
          output += ' ';
          continue;
        }
        if (Math.random() < 0.48) item.char = this.randomChar();
        const phase = Math.min(1, Math.max(0, (this.frame - start) / Math.max(1, end - start)));
        const opacity = (0.35 + phase * 0.65).toFixed(2);
        output += `<span class="glitch-char" style="opacity:${opacity}">${item.char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.el.textContent = this.queue.map(q => q.to).join('');
      if (this.resolve) this.resolve();
      return;
    }
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

    function createScrambler(el) {
    if (window.TextScramble) {
      return new window.TextScramble(el);
    }
    return new FallbackTextScramble(el);
  }

  /* ==========================================================================
     2. Hero Typewriter Director
     Simulates realistic typing of introduction text with blinking cursor
     ========================================================================== */
  class AboutTypewriter {
    constructor() {
      this.container = document.querySelector('.typewriter-block');
      this.textEl = document.querySelector('.typewriter-text');
      if (!this.container || !this.textEl) return;

      this.hasStarted = false;
      this.finished = false;
      this._timer = null;
      this._runId = 0;
      this.progressRatio = 0;

      this.cursorEl = document.createElement('span');
      this.cursorEl.className = 'typewriter-cursor';
      this.cursorEl.textContent = '▌';
      this.cursorEl.setAttribute('aria-hidden', 'true');

      this.refreshSource();
      window.addEventListener('langchange', () => {
        const resumeRatio = this.progressRatio;
        this.cancel();
        this.finished = false;
        this.refreshSource();
        this.start(resumeRatio);
      });

      setTimeout(() => this.start(), 200);
    }

    refreshSource() {
      if (window.I18N) {
        this.fullHTML = window.I18N.t('about.intro_html');
      } else {
        this.fullHTML = this.textEl.innerHTML.trim();
      }
    }

    cancel() {
      this._runId++;
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    }

    start(resumeRatio = this.progressRatio) {
      if (this.hasStarted && this.finished) return;
      this.hasStarted = true;
      this.finished = false;
      this.refreshSource();
      this.textEl.innerHTML = '';

      const runId = ++this._runId;
      const tokens = [];
      let i = 0;
      while (i < this.fullHTML.length) {
        if (this.fullHTML[i] === '<') {
          let end = this.fullHTML.indexOf('>', i);
          if (end === -1) end = this.fullHTML.length;
          tokens.push({ type: 'tag', val: this.fullHTML.slice(i, end + 1) });
          i = end + 1;
        } else {
          tokens.push({ type: 'char', val: this.fullHTML[i] });
          i++;
        }
      }

      let output = '';
      let idx = 0;
      const totalChars = tokens.reduce((count, token) => count + (token.type === 'char' ? 1 : 0), 0);
      const targetChars = Math.max(0, Math.min(totalChars, Math.round(totalChars * resumeRatio)));
      let visibleChars = 0;

      while (idx < tokens.length && visibleChars < targetChars) {
        const token = tokens[idx];
        output += token.val;
        if (token.type === 'char') visibleChars++;
        idx++;
      }
      this.progressRatio = totalChars ? visibleChars / totalChars : 1;

      const closeOpenTags = (html) => {
        const open = [];
        const re = /<\/?([a-zA-Z][^\s/>]*)(?:\s[^>]*)?>/g;
        let m;
        while ((m = re.exec(html))) {
          const raw = m[0];
          const name = m[1].toLowerCase();
          if (raw.startsWith('</')) {
            const at = open.lastIndexOf(name);
            if (at !== -1) open.splice(at, 1);
          } else if (!raw.endsWith('/>') && !['br','img','hr','input','meta','link'].includes(name)) {
            open.push(name);
          }
        }
        return open.reverse().map(name => `</${name}>`).join('');
      };

      const render = () => {
        this.textEl.innerHTML = output + closeOpenTags(output);
        this.textEl.appendChild(this.cursorEl);
      };

      const tick = () => {
        if (runId !== this._runId) return;
        if (idx >= tokens.length) {
          this.progressRatio = 1;
          this.textEl.innerHTML = output;
          this.textEl.appendChild(this.cursorEl);
          this.finished = true;
          this._timer = null;
          return;
        }

        while (idx < tokens.length && tokens[idx].type === 'tag') {
          output += tokens[idx].val;
          idx++;
        }

        if (idx < tokens.length && tokens[idx].type === 'char') {
          const char = tokens[idx].val;
          output += char;
          idx++;
          visibleChars++;
          this.progressRatio = totalChars ? visibleChars / totalChars : 1;
          render();

          let delay = 16;
          if (char === '.' || char === '—') delay = 80;
          else if (char === ',') delay = 40;
          else if (char === ' ') delay = 18;

          this._timer = setTimeout(tick, delay);
        } else {
          render();
          this._timer = setTimeout(tick, 10);
        }
      };

      tick();
    }
  }

  /* ==========================================================================
     3. Unified 'about' Runner & Pinned Process Collage
     Orchestrates the floating 'about' title descend and parallax collage cards
     ========================================================================== */
  class AboutUnifiedDirector {
    constructor() {
      this.runner = document.getElementById('unified-about');
      this.heroAnchor = document.getElementById('hero-about-anchor');
      this.track = document.getElementById('process-track');
      this.cards = document.querySelectorAll('.collage-card');
      if (!this.runner || !this.track) return;

      this.cardFlyIns = [
        { id: 1, fromX: -75, fromY: -15, rot: -2.5 },
        { id: 2, fromX: 40,  fromY: -75, rot: 1.8  },
        { id: 3, fromX: 85,  fromY: 10,  rot: -1.2 },
        { id: 4, fromX: 55,  fromY: 80,  rot: 2.2  },
        { id: 5, fromX: -60, fromY: 75,  rot: 2.8  },
        { id: 6, fromX: 0,   fromY: 0,   rot: 0    },
        { id: 7, fromX: 15,  fromY: -80, rot: -1.5 },
        { id: 8, fromX: 80,  fromY: 65,  rot: 1.5  }
      ];

      this.cardWindows = [
        { start: 0.04, end: 0.20 },
        { start: 0.14, end: 0.30 },
        { start: 0.24, end: 0.40 },
        { start: 0.34, end: 0.50 },
        { start: 0.44, end: 0.60 },
        { start: 0.54, end: 0.70 },
        { start: 0.64, end: 0.80 },
        { start: 0.74, end: 0.88 }
      ];

      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
      this.onScroll();
    }

    runnerScale() {
      const baseScale = 0.92;
      const left = this.heroAnchor ? this.heroAnchor.getBoundingClientRect().left : 24;
      const targetWidth = Math.max(120, window.innerWidth * 0.82 - left);
      const naturalWidth = Math.max(1, this.runner.offsetWidth);
      return Math.min(baseScale, targetWidth / naturalWidth).toFixed(4);
    }

    smoothStep(t) {
      return t * t * (3 - 2 * t);
    }

    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    onScroll() {
      const winH = window.innerHeight;
      const trackRect = this.track.getBoundingClientRect();
      const scrollDistance = this.track.offsetHeight - winH;

      if (this.heroAnchor) {
        const anchorRect = this.heroAnchor.getBoundingClientRect();
        const stageTargetTop = (winH - this.runner.offsetHeight) * 0.5;

        if (trackRect.top > 0) {
          const heroScrollLimit = Math.max(winH * 0.65, 100);
          const heroProgress = Math.min(Math.max(window.scrollY / heroScrollLimit, 0), 1);
          const curTop = anchorRect.top + (stageTargetTop - anchorRect.top) * heroProgress;

          this.runner.style.top = `${curTop}px`;
          this.runner.style.left = `${anchorRect.left}px`;
          this.runner.style.transform = `translate(0px, 0) scaleX(${this.runnerScale()})`;
          this.runner.style.opacity = '1';
          this.runner.style.visibility = 'visible';
          this.runner.style.zIndex = '2';
        } else {
          const scrolled = -trackRect.top;
          const progress = Math.min(Math.max(scrolled / scrollDistance, 0), 1);

          const runnerW = this.runner.offsetWidth || 300;
          const targetRightBorder = window.innerWidth * 0.82;
          const maxShift = Math.max(targetRightBorder - anchorRect.left - runnerW, window.innerWidth * 0.48);

          const shiftX = (this.smoothStep(progress) * maxShift).toFixed(1);

          this.runner.style.top = `${stageTargetTop}px`;
          this.runner.style.left = `${anchorRect.left}px`;
          this.runner.style.transform = `translate(${shiftX}px, 0) scaleX(${this.runnerScale()})`;
          this.runner.style.zIndex = '2';

          if (progress >= 0.96 || trackRect.bottom <= winH) {
            const fadeOut = Math.max(0, (trackRect.bottom - winH * 0.35) / (winH * 0.65));
            this.runner.style.opacity = fadeOut.toFixed(2);
            if (fadeOut <= 0.02) {
              this.runner.style.visibility = 'hidden';
            } else {
              this.runner.style.visibility = 'visible';
            }
          } else {
            this.runner.style.opacity = '1';
            this.runner.style.visibility = 'visible';
          }
        }
      }

      if (scrollDistance <= 0) return;
      const scrolled = -trackRect.top;
      const progress = Math.min(Math.max(scrolled / scrollDistance, 0), 1);

      this.cards.forEach((card, idx) => {
        const isLogo = card.classList.contains('card-logo');
        const fly = this.cardFlyIns[idx] || { fromX: 0, fromY: 50, rot: 0 };
        const win = this.cardWindows[idx] || { start: 0, end: 1 };

        if (isLogo) {
          if (progress < win.start) {
            card.style.transform = 'translate3d(0, 0, 0) scale(0) rotate(-65deg)';
            card.style.opacity = '0';
            card.classList.remove('is-active');
            card.style.setProperty('--cur-x', '0px');
            card.style.setProperty('--cur-y', '0px');
          } else if (progress >= win.start && progress <= win.end) {
            const localP = (progress - win.start) / (win.end - win.start);
            const easeP = this.easeOutCubic(localP);
            const curScale = (easeP).toFixed(3);
            const curRot = (-65 * (1 - easeP)).toFixed(1);
            const curOpacity = Math.min(easeP * 1.5, 1).toFixed(2);

            card.style.transform = `translate3d(0, 0, 0) scale(${curScale}) rotate(${curRot}deg)`;
            card.style.opacity = curOpacity;
            card.classList.add('is-active');
            card.style.setProperty('--cur-x', '0px');
            card.style.setProperty('--cur-y', '0px');
          } else {
            card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            card.style.opacity = '1';
            card.classList.add('is-active');
            card.style.setProperty('--cur-x', '0px');
            card.style.setProperty('--cur-y', '0px');
          }
        } else {
          if (progress < win.start) {
            card.style.transform = `translate3d(${fly.fromX}vw, ${fly.fromY}vh, 0) rotate(${fly.rot}deg)`;
            card.style.opacity = '0';
            card.classList.remove('is-active');
            card.style.setProperty('--cur-x', `${fly.fromX}vw`);
            card.style.setProperty('--cur-y', `${fly.fromY}vh`);
          } else if (progress >= win.start && progress <= win.end) {
            const localP = (progress - win.start) / (win.end - win.start);
            const easeP = this.easeOutCubic(localP);
            const curX = (fly.fromX * (1 - easeP)).toFixed(1);
            const curY = (fly.fromY * (1 - easeP)).toFixed(1);
            const curRot = (fly.rot * (1 - easeP * 0.2)).toFixed(1);
            const curOpacity = Math.min(easeP * 1.6, 1).toFixed(2);

            card.style.transform = `translate3d(${curX}vw, ${curY}vh, 0) rotate(${curRot}deg)`;
            card.style.opacity = curOpacity;
            card.classList.add('is-active');
            card.style.setProperty('--cur-x', `${curX}vw`);
            card.style.setProperty('--cur-y', `${curY}vh`);
          } else {
            card.style.transform = `translate3d(0, 0, 0) rotate(${fly.rot}deg)`;
            card.style.opacity = '1';
            card.classList.add('is-active');
            card.style.setProperty('--cur-x', '0px');
            card.style.setProperty('--cur-y', '0px');
          }
        }

        if (progress > 0.88) {
          const bwP = Math.min((progress - 0.88) / 0.12, 1);
          card.style.setProperty('--card-gray', bwP.toFixed(2));
        } else {
          card.style.setProperty('--card-gray', '0');
        }
      });
    }
  }

  /* ==========================================================================
     4. Word-by-Word Dynamic Blur Scroll Reveal
     Reveals text tokens from blur to sharp focus as the user scrolls
     ========================================================================== */
  class WordByWordBlurDirector {
    constructor(textSelector, tokenSelector, isCommunity = false) {
      this.textEl = document.querySelector(textSelector);
      if (!this.textEl) return;
      this.tokenSelector = tokenSelector;
      this.tokens = this.textEl.querySelectorAll(tokenSelector);
      if (!this.tokens.length) return;

      this.isCommunity = isCommunity;
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
      this.onScroll();
    }

    refresh() {
      this.tokens = this.textEl ? this.textEl.querySelectorAll(this.tokenSelector) : [];
      this.onScroll();
    }

    onScroll() {
      const winH = window.innerHeight;
      const rect = this.textEl.getBoundingClientRect();
      const docH = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;

      const isNearBottom = (scrollY + winH) >= (docH - 120);

      if (rect.bottom <= winH * 0.88 || isNearBottom) {
        this.tokens.forEach(token => {
          token.style.filter = 'blur(0px)';
          token.style.opacity = '1';
          if (this.isCommunity) token.style.transform = 'translateY(0px)';
        });
        return;
      }

      const enterLine = winH * 0.88;
      const leaveLine = winH * 0.38;
      const travel = Math.max((enterLine - leaveLine) + rect.height * 0.6, 80);
      const current = enterLine - rect.top;
      const progress = Math.min(Math.max(current / travel, 0), 1);

      const totalWords = this.tokens.length;
      const focalHead = progress * (totalWords + 2);

      this.tokens.forEach((token, idx) => {
        const diff = idx - focalHead;

        if (diff <= 0) {
          token.style.filter = 'blur(0px)';
          token.style.opacity = '1';
          if (this.isCommunity) {
            token.style.transform = 'translateY(0px)';
          }
        } else {
          const norm = Math.min(diff / 3.0, 1);
          const blurPx = (norm * 5.5).toFixed(1);
          const opacity = (1 - norm * 0.75).toFixed(2);

          token.style.filter = `blur(${blurPx}px)`;
          token.style.opacity = opacity;

          if (this.isCommunity) {
            const ty = (norm * 16).toFixed(1);
            token.style.transform = `translateY(${ty}px)`;
          }
        }
      });
    }
  }

  /* ==========================================================================
     5. Specializing In: 100vw Sequential Black Wipe Bars
     Scroll-linked wipe bars and hover text scrambling on service rows
     ========================================================================== */
  class SpecializingSectionDirector {
    constructor() {
      this.section = document.getElementById('specializing-section');
      this.rows = document.querySelectorAll('.spec-row');
      if (!this.section || !this.rows.length) return;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.section.classList.add('is-triggered');
          observer.disconnect();
        }
      }, { threshold: 0.16 });
      observer.observe(this.section);

      this.rows.forEach((row) => {
        const titleEl = row.querySelector('.spec-title');
        if (!titleEl) return;
        const scrambler = createScrambler(titleEl);
        let busy = false;

        row.addEventListener('mouseenter', () => {
          if (busy) return;
          busy = true;
          const key = titleEl.getAttribute('data-i18n');
          const target = (key && window.I18N)
            ? window.I18N.t(key)
            : titleEl.textContent.trim();
          scrambler.setText(target).then(() => { busy = false; });
        });
      });

      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    }

    onScroll() {
      const winH = window.innerHeight;
      this.rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        if (rect.top < winH * 0.45) {
          const p = Math.min(Math.max((winH * 0.45 - rect.top) / (winH * 0.65), 0), 1);
          const scale = (1 - p * 0.05).toFixed(3);
          const opacity = (1 - p * 0.15).toFixed(2);
          row.style.transform = `scale(${scale})`;
          row.style.opacity = opacity;
          row.style.transformOrigin = 'center center';
        } else {
          row.style.transform = 'scale(1)';
          row.style.opacity = '1';
        }
      });
    }
  }

  /* ==========================================================================
     6. Community Section Glitch Hover
     Trigger scramble effect on hovering the giant community word
     ========================================================================== */
  function initCommunityHoverScramble() {
    const commEl = document.getElementById('glitch-community');
    if (!commEl) return;
    const scrambler = createScrambler(commEl);

    commEl.addEventListener('mouseenter', () => {
      const key = commEl.getAttribute('data-i18n');
      const target = (key && window.I18N) ? window.I18N.t(key) : commEl.textContent.trim();
      scrambler.setText(target);
    });
  }

  /* ==========================================================================
     7. About Page Anchor Navigation & Smooth Scrolling
     ========================================================================== */
  function initAboutAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    });

    if (window.location.hash === '#contacts') {
      setTimeout(() => {
        const contactsEl = document.getElementById('contacts');
        if (contactsEl) {
          contactsEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 200);
    }
  }

  let manifestoDirector = null;
  let communityDirector = null;

  /* ==========================================================================
     8. About Page DOMContentLoaded Lifecycle Initializer
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    new AboutTypewriter();
    new AboutUnifiedDirector();
    manifestoDirector = new WordByWordBlurDirector('#manifesto-text', '.blur-token', false);
    new SpecializingSectionDirector();
    communityDirector = new WordByWordBlurDirector('#community-text', '.comm-token', true);
    initCommunityHoverScramble();
    initAboutAnchorScroll();
  });

  window.addEventListener('langchange', () => {
    if (manifestoDirector) manifestoDirector.refresh();
    if (communityDirector) communityDirector.refresh();
  });

})();

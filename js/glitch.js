/* ==========================================================================
   TextScramble: Progressive Wave Glitch Effect
   Glitch-decodes text left-to-right; first 2 letters remain protected/stable
   ========================================================================== */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#01XYZabcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
    this.frameRequest = null;
    this.frame = 0;
    this.resolve = null;
    this.running = false;
  }

  // --- Animation Queue Setup ---
  setText(newText) {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }

    const target = String(newText || '');
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, target.length);
    const promise = new Promise((resolve) => { this.resolve = resolve; });
    this.queue = [];
    this.running = true;

    let nonSpaceSeen = 0;

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = target[i] || '';

      if (to === ' ' || to === '') {
        this.queue.push({ to: to || ' ', start: 0, end: 0 });
        continue;
      }

      nonSpaceSeen++;
      // First 2 characters are never scrambled
      if (nonSpaceSeen <= 2) {
        this.queue.push({ to, start: 0, end: 0 });
        continue;
      }

      // Progressive wave delays: subsequent letters start and resolve later
      const wave = nonSpaceSeen - 3;
      const start = 2 + wave * 5;
      const duration = 18 + Math.floor(Math.random() * 10);
      const end = start + duration;

      this.queue.push({
        to,
        start,
        end,
        char: this.randomChar(),
      });
    }

    this.frame = 0;
    this.update();
    return promise;
  }

  // --- Render Frame Loop ---
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
        if (Math.random() < 0.55) item.char = this.randomChar();
        output += item.char;
      } else {
        if (start === 0) {
          output += to;
          complete++;
        } else {
          if (Math.random() < 0.4) item.char = this.randomChar();
          output += item.char || this.randomChar();
        }
      }
    }

    this.el.textContent = output;

    if (complete === this.queue.length) {
      this.el.textContent = this.queue.map((q) => q.to).join('');
      this.running = false;
      if (this.resolve) this.resolve();
      this.resolve = null;
      return;
    }

    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

window.TextScramble = TextScramble;

// --- Auto-bind to [data-scramble] Elements on Hover ---
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const scrambler = new TextScramble(el);
    let isRunning = false;

    el.addEventListener('mouseenter', () => {
      if (isRunning || scrambler.running) return;
      isRunning = true;
      const key = el.getAttribute('data-i18n');
      const target = (key && window.I18N)
        ? window.I18N.t(key)
        : (el.textContent || el.getAttribute('data-scramble') || '').trim();
      scrambler.setText(target).then(() => {
        isRunning = false;
      });
    });
  });
});

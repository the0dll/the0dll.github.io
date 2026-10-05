/**
 * Cybernetic Glitch & Character Scramble Effect
 * Inspired by TouchDesigner realtime parameter monitors & creative coding aesthetics.
 */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________0101XYZ';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    // First 1–2 characters should never glitch — keep them stable
    const protectedCount = Math.min(2, length);
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      if (i < protectedCount) {
        // Protected letters: appear immediately, no scramble
        this.queue.push({ from, to, start: 0, end: 0 });
      } else {
        // Slower, smoother glitch for the rest
        const start = Math.floor(Math.random() * 28) + 6;
        const end = start + Math.floor(Math.random() * 28) + 10;
        this.queue.push({ from, to, start, end });
      }
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
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="glitch-char" style="opacity: 0.7; color: #ffffff;">${char}</span>`;
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

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize scramblers for elements with [data-scramble]
window.addEventListener('DOMContentLoaded', () => {
  const scrambleElements = document.querySelectorAll('[data-scramble]');

  scrambleElements.forEach((el) => {
    const originalText = el.innerText.trim();
    const scrambler = new TextScramble(el);
    let isRunning = false;

    el.addEventListener('mouseenter', () => {
      if (isRunning) return;
      isRunning = true;
      scrambler.setText(originalText).then(() => {
        isRunning = false;
      });
    });
  });
});

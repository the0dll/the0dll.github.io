/* ==========================================================================
   Hero Image Pixelate Reveal Animation
   Stepped pixel resolution downscale/upscale reveal on initial load
   ========================================================================== */

(function () {
  const box = document.getElementById('animated-media');
  const img = box && box.querySelector('img');
  if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // --- Animation Settings: Block pixel size steps (coarse to fine) ---
  const STEPS = [40, 24, 14, 8, 4, 2];
  const STEP_MS = 150;

  function run() {
    if (!img.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(box.clientWidth * dpr);
    const H = Math.round(box.clientHeight * dpr);

    // Compute contain-fit bounds
    const k = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const dw = Math.round(img.naturalWidth * k), dh = Math.round(img.naturalHeight * k);
    const dx = Math.round((W - dw) / 2), dy = Math.round((H - dh) / 2);

    // Create temporary pixelation canvas
    const cv = document.createElement('canvas');
    cv.className = 'hero-pixel-canvas';
    cv.width = W; cv.height = H;
    cv.setAttribute('aria-hidden', 'true');
    const ctx = cv.getContext('2d');
    const tiny = document.createElement('canvas');
    const tctx = tiny.getContext('2d');
    box.appendChild(cv);
    img.style.visibility = 'hidden';

    // --- Render Low-Resolution Stepped Pixel Pass ---
    function draw(block) {
      const bw = Math.max(1, Math.round(dw / (block * dpr)));
      const bh = Math.max(1, Math.round(dh / (block * dpr)));
      tiny.width = bw; tiny.height = bh;
      tctx.imageSmoothingEnabled = true;
      tctx.drawImage(img, 0, 0, bw, bh);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tiny, 0, 0, bw, bh, dx, dy, dw, dh);
    }

    // --- Stepped Resolution Animation Timer ---
    let i = 0;
    draw(STEPS[0]);
    const timer = setInterval(() => {
      i++;
      if (i >= STEPS.length) {
        clearInterval(timer);
        img.style.visibility = '';
        cv.remove();
        return;
      }
      draw(STEPS[i]);
    }, STEP_MS);
  }

  // --- Image Load Event Trigger ---
  if (img.complete) run(); else img.addEventListener('load', run, { once: true });
})();

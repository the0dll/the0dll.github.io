/* ==========================================================================
   The0dllCursor: Interactive Canvas Cursor & Kinetic Particle Trail
   Simulates physics lag, stretch-and-squash on velocity, and fading particle trail
   ========================================================================== */

class The0dllCursor {
  constructor() {
    this.canvas = document.getElementById('cursor-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    // Disable on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    // --- Physics & Geometry Settings ---
    this.baseRadius = 40;       // Head circle base radius
    this.trailRadius = 52;      // Particle radius
    this.currentScale = 1.0;
    this.lerp = 0.20;           // Mouse tracking elasticity (lower = softer lag)

    this.mouse = { x: -600, y: -600 };
    this.prevMouse = { x: -600, y: -600 };
    this.target = { x: -600, y: -600 };
    this.lastSpawn = { x: -600, y: -600 };
    this.speed = 0;
    this.angle = 0;
    this.isVisible = false;

    // --- Trail Particles Configuration ---
    this.particles = [];
    this.decayRate = 0.007;     // Particle evaporation rate
    this.minDistToSpawn = 4;
    this.maxParticles = 180;

    this.sprite = this.generateSprite();

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);

    this.init();
  }

  // --- Pre-render Soft Particle Radial Gradient ---
  generateSprite() {
    const size = this.trailRadius * 2;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext('2d');

    const grad = sctx.createRadialGradient(
      this.trailRadius, this.trailRadius, 0,
      this.trailRadius, this.trailRadius, this.trailRadius
    );
    grad.addColorStop(0,    'rgba(255,255,255,0.70)');
    grad.addColorStop(0.3,  'rgba(255,255,255,0.35)');
    grad.addColorStop(0.65, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, size, size);
    return sprite;
  }

  // --- Event Listeners & Canvas Setup ---
  init() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseenter', this.onMouseEnter);
    document.addEventListener('mouseleave', this.onMouseLeave);
    requestAnimationFrame(this.render);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  onMouseMove(e) {
    this.isVisible = true;
    this.target.x = e.clientX;
    this.target.y = e.clientY;

    if (this.mouse.x === -600) {
      this.mouse.x = this.target.x;
      this.mouse.y = this.target.y;
      this.prevMouse.x = this.target.x;
      this.prevMouse.y = this.target.y;
      this.lastSpawn.x = this.target.x;
      this.lastSpawn.y = this.target.y;
    }
  }

  onMouseEnter(e) {
    this.isVisible = true;
    if (e && e.clientX !== undefined) {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
      this.lastSpawn.x = e.clientX;
      this.lastSpawn.y = e.clientY;
      this.speed = 0;
    }
  }

  onMouseLeave() {
    this.isVisible = false;
  }

  // --- Physics Simulation & Render Loop ---
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.suppressed) {
      requestAnimationFrame(this.render);
      return;
    }

    if (this.isVisible && this.mouse.x !== -600) {
      // 1. Smooth mouse tracking interpolation
      this.mouse.x += (this.target.x - this.mouse.x) * this.lerp;
      this.mouse.y += (this.target.y - this.mouse.y) * this.lerp;

      // 2. Velocity and kinetic stretch computation
      const vx = this.mouse.x - this.prevMouse.x;
      const vy = this.mouse.y - this.prevMouse.y;
      const instantSpeed = Math.hypot(vx, vy);

      this.speed += (instantSpeed - this.speed) * 0.20;

      const maxSpeed = 34;
      const speedFactor = Math.min(this.speed / maxSpeed, 1);

      const targetScale = 1 - speedFactor * 0.48;
      this.currentScale += (targetScale - this.currentScale) * 0.22;

      // Smooth orientation angle along movement vector
      if (instantSpeed > 0.4) {
        const targetAngle = Math.atan2(vy, vx);
        let diff = targetAngle - this.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.angle += diff * 0.25;
      }

      // 3. Spawn trail particles along movement vector
      const dx = this.mouse.x - this.lastSpawn.x;
      const dy = this.mouse.y - this.lastSpawn.y;
      const dist = Math.hypot(dx, dy);

      if (dist >= this.minDistToSpawn) {
        const step = 8;
        const count = Math.max(1, Math.min(Math.floor(dist / step), 4));
        for (let s = 1; s <= count; s++) {
          const t = s / count;
          if (this.particles.length >= this.maxParticles) {
            this.particles.shift();
          }
          this.particles.push({
            x: this.lastSpawn.x + dx * t,
            y: this.lastSpawn.y + dy * t,
            life: 1.0
          });
        }
        this.lastSpawn.x = this.mouse.x;
        this.lastSpawn.y = this.mouse.y;
      }

      // 4. Render fading trail particles
      this.ctx.globalCompositeOperation = 'lighter';

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        const midFactor = Math.sin(p.life * Math.PI);
        const midAlphaDip = 1 - speedFactor * 0.25 * midFactor;
        const alpha = p.life * p.life * midAlphaDip;

        this.ctx.globalAlpha = alpha * 0.75;
        this.ctx.drawImage(
          this.sprite,
          p.x - this.trailRadius,
          p.y - this.trailRadius
        );

        const midDecayBoost = 1 + speedFactor * 1.35 * midFactor;
        p.life -= this.decayRate * midDecayBoost;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // 5. Render cursor head with squash-and-stretch
      const stretchX = 1 + speedFactor * 0.35;
      const squashY = 1 - speedFactor * 0.40;
      const finalScaleX = this.currentScale * stretchX;
      const finalScaleY = this.currentScale * squashY;

      this.ctx.save();
      this.ctx.translate(this.mouse.x, this.mouse.y);
      this.ctx.rotate(this.angle);
      this.ctx.scale(finalScaleX, finalScaleY);

      // Outer glow
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.globalAlpha = 0.40;
      this.ctx.drawImage(
        this.sprite,
        -this.trailRadius * 0.9,
        -this.trailRadius * 0.9,
        this.trailRadius * 1.8,
        this.trailRadius * 1.8
      );

      // Main core circle
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.baseRadius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();

      this.prevMouse.x = this.mouse.x;
      this.prevMouse.y = this.mouse.y;
    }

    requestAnimationFrame(this.render);
  }
}

// --- Initialize Cursor Controller on Load ---
window.addEventListener('DOMContentLoaded', () => {
  window.the0dllCursor = new The0dllCursor();
});

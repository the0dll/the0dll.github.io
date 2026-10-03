(() => {
  'use strict';

  // ===== Cursor glow =====
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const animateGlow = () => {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  // ===== Nav scroll =====
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Reveal on scroll =====
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));

  // Hero elements should appear almost immediately
  const heroReveals = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 150);

  // ===== Smooth anchor scroll (extra polish) =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

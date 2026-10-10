/* ==========================================================================
   Connections & Intersections Physics Graph
   Interactive force-directed graph with drag, repulsion, springs, and avatar circles
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. Graph Nodes & Connections Data
     Add, remove, or edit avatars, labels, roles, and edge links here
     ========================================================================== */
  const NODES_DATA = [
    { id: 'the0dll',    name: 'the0dll',        role: 'me',                       image: 'assets/avatars/me.jpg',          group: 'center'    },
    { id: 'tigris',     name: 'Tigris',          role: 'NewEra',                   image: 'assets/avatars/tigris.jpg',      group: 'people'    },
    { id: 'gamdav',     name: 'Gamdav',          role: 'Shape',                    image: 'assets/avatars/gamdav.jpg',      group: 'people'    },
    { id: 'bedno',      name: 'Bedno',           role: 'Bloomy',                   image: 'assets/avatars/bedno.jpg',       group: 'people'    },
    { id: 'pigeonov',   name: 'pigeonov',        role: 'Elytra',                   image: 'assets/avatars/pigeonov.png',    group: 'people'    },
    { id: 'illystray',  name: 'illystray',       role: 'BDEngine',                 image: 'assets/avatars/illystray.jpg',   group: 'people'    },
    { id: 'monkesha',   name: 'What / Monkesha', role: 'designer',                 image: 'assets/avatars/what.jpg',        group: 'people'    },
    { id: 'lorutskii',  name: 'lorutskii',       role: 'streamer',                 image: 'assets/avatars/lorutskii.jpg',   group: 'people'    },
    { id: 'toolki',     name: 'Toolki1',         role: 'long-term client / streamer', image: 'assets/avatars/toolki1.jpg',  group: 'people'    },
    { id: 'notrofls',   name: 'notrofls',        role: 'youtuber / tiktoker',      image: 'assets/avatars/notrofls.jpg',    group: 'people'    },
    { id: 'dravenit',   name: 'Dravenit',        role: 'artist',                   image: 'assets/avatars/dravenit.jpg',    group: 'people'    },
    { id: 'jesse',      name: 'Jesse',           role: 'artist',                   image: 'assets/avatars/jesse.jpg',       group: 'people'    },
    { id: 'krimsshi',   name: 'Krimsshi',        role: 'videographer',             image: 'assets/avatars/krimsshi.jpg',    group: 'people'    },
    { id: 'pwgood',     name: 'PWGood',          role: 'streamer',                 image: 'assets/avatars/pwgood.jpg',      group: 'people'    },
    { id: 'newera',     name: 'NewEra',          role: 'studio',                   image: 'assets/avatars/newera.jpg',      group: 'projects'  },
    { id: 'shape',      name: 'Shape',           role: 'studio',                   image: 'assets/avatars/shape.jpg',       group: 'projects'  },
    { id: 'bloomy',     name: 'Bloomy',          role: 'server',                   image: 'assets/avatars/bloomy.jpg',      group: 'projects'  },
    { id: 'elytra',     name: 'Elytra',          role: 'server',                   image: 'assets/avatars/elytra.png',      group: 'projects', darkBg: true },
    { id: 'bdengine',   name: 'BDEngine',        role: 'engine',                   image: 'assets/avatars/bdengine.webp',   group: 'projects', darkBg: true },
    { id: 'melur',      name: 'Melur',           role: 'server',                   image: 'assets/avatars/melur.jpg',       group: 'projects'  },
    { id: 'spemotes',   name: 'SPEmotes',        role: 'emotes',                   image: 'assets/avatars/spemotes.jpg',    group: 'projects'  },
    { id: 'multiverse', name: 'Multiverse',      role: 'community',                image: 'assets/avatars/multiverse.png',  group: 'community' },
    { id: 'privatclub', name: 'Privat Club',     role: 'community',                image: 'assets/avatars/privatclub.jpg',  group: 'community' },
  ];

  const LINKS_DATA = [
    ['the0dll', 'tigris'],    ['tigris', 'newera'],    ['the0dll', 'newera'],
    ['the0dll', 'gamdav'],    ['gamdav', 'shape'],     ['the0dll', 'shape'],
    ['bedno', 'bloomy'],      ['newera', 'bloomy'],
    ['the0dll', 'pigeonov'],  ['pigeonov', 'elytra'],
    ['the0dll', 'illystray'], ['illystray', 'bdengine'],
    ['the0dll', 'monkesha'],
    ['the0dll', 'lorutskii'],
    ['the0dll', 'toolki'],    ['toolki', 'melur'],
    ['the0dll', 'notrofls'],
    ['the0dll', 'jesse'],     ['jesse', 'dravenit'],
    ['the0dll', 'krimsshi'],
    ['the0dll', 'multiverse'],
    ['the0dll', 'privatclub'],
    ['tigris',    'privatclub'], ['gamdav',   'privatclub'],
    ['dravenit',  'privatclub'], ['jesse',    'privatclub'],
    ['krimsshi',  'privatclub'], ['krimsshi', 'multiverse'],
    ['pigeonov',  'multiverse'], ['tigris',   'multiverse'],
    ['gamdav',    'multiverse'], ['bedno',    'multiverse'],
    ['notrofls',  'multiverse'], ['illystray','multiverse'],
    ['monkesha',  'multiverse'],
    ['spemotes',  'newera'],     ['spemotes', 'tigris'],
    ['pwgood',    'shape'],      ['pwgood',   'gamdav'],
  ];


  /* ==========================================================================
     2. Role Localization Mapping
     ========================================================================== */
  const ROLE_KEYS = {
    the0dll: 'role.me',
    monkesha: 'role.designer',
    lorutskii: 'role.streamer',
    toolki: 'role.client',
    notrofls: 'role.youtuber',
    dravenit: 'role.artist',
    jesse: 'role.artist',
    krimsshi: 'role.videographer',
    pwgood: 'role.streamer',
    newera: 'role.studio',
    shape: 'role.studio',
    bloomy: 'role.server',
    elytra: 'role.server',
    bdengine: 'role.engine',
    melur: 'role.server',
    spemotes: 'role.emotes',
    multiverse: 'role.community',
    privatclub: 'role.community',
  };

  function roleLabel(node) {
    const key = ROLE_KEYS[node.id];
    if (key && window.I18N) return window.I18N.t(key);
    return node.role;
  }

  const GROUP_COLOURS = {
    center:    '#f2f0eb',
    people:    '#6b8cff',
    projects:  '#ff7c5c',
    community: '#5cdcb1',
  };

  /* ==========================================================================
     3. Physics Engine Configuration
     Spring tension, repulsion force, damping, and settling thresholds
     ========================================================================== */
  const SPRING_LEN  = 155;
  const SPRING_K    = 0.032;
  const REPULSION   = 4800;
  const DAMPING     = 0.91;
  const CENTER_PULL = 0;
  const MAX_SPEED   = 9;
  const SETTLE_VEL  = 0.07;

  const LS_KEY = 'conn_positions_v2';

  const NODE_RADIUS_MAP = {
    the0dll: 34,
    tigris: 30, newera: 30, toolki: 30,
    shape: 27, lorutskii: 27,
    monkesha: 25, pigeonov: 25, illystray: 25, elytra: 25, bdengine: 25, spemotes: 25,
    melur: 23, bloomy: 23, jesse: 23, notrofls: 23, krimsshi: 23, gamdav: 23, privatclub: 23, multiverse: 23,
  };

  /* Small-canvas scaling: physics + node sizes shrink on narrow screens (desktop = 1) */
  let layoutK = 1;   // spacing scale
  let radiusK = 1;   // node radius scale
  function updateScale() {
    if (W >= 900) { layoutK = 1; radiusK = 1; return; }
    layoutK = Math.max(0.5, Math.min(1, Math.min(W, H * 0.9) / 700));
    radiusK = 0.5 + 0.5 * layoutK;
  }

  function nodeRadius(node) {
    return (NODE_RADIUS_MAP[node.id] || 20) * radiusK;
  }

  /* Solid (work / direct project) connections; order of pair does not matter */
  const SOLID_PAIRS = [
    ['the0dll', 'tigris'],   ['the0dll', 'newera'],    ['the0dll', 'shape'],
    ['the0dll', 'toolki'],   ['the0dll', 'lorutskii'], ['the0dll', 'pigeonov'],
    ['the0dll', 'illystray'],['the0dll', 'monkesha'],  ['tigris', 'newera'],
    ['gamdav', 'shape'],     ['toolki', 'melur'],      ['gamdav', 'the0dll'],
  ];
  const SOLID_KEYS = new Set(SOLID_PAIRS.map(([a, b]) => [a, b].sort().join('|')));
  function isSolidLink(a, b) {
    return SOLID_KEYS.has([a, b].sort().join('|'));
  }

  /* About-section CTA: smooth scroll to the graph section */
  document.querySelectorAll('[data-scroll-to-connections]').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = document.getElementById('connections-section');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const canvas  = document.getElementById('connections-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const tooltip = document.getElementById('conn-tooltip');
  const ttName  = tooltip.querySelector('.conn-tooltip-name');
  const ttRole  = tooltip.querySelector('.conn-tooltip-role');

  let W = 0, H = 0;
  let nodes = [];
  let links = [];
  const images = {};
  let imagesLoaded = 0;
  let imagesTotal  = 0;
  let animId = null;
  let simActive = true;
  let hoveredNode = null;
  let dragNode    = null;
  let dragOffX = 0, dragOffY = 0;
  let loopRunning = false;

  /* ==========================================================================
     Mobile pinch-zoom view transform
     screen = world * zoom + pan. Physics/nodes stay in world space (0..W, 0..H);
     only drawing and hit-testing use the view. Desktop: zoom 1, pan 0 (identity).
     ========================================================================== */
  const ZOOM_MIN = 1, ZOOM_MAX = 3.5;
  let zoom = 1, panX = 0, panY = 0;
  let pinch = null;           // active two-finger gesture state
  let resetBtn = null;

  function zoomEnabled() {
    return window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 900;
  }

  /* Keep the world rect covering the canvas so nodes can never be lost off-screen */
  function clampView() {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));
    panX = Math.min(0, Math.max(W - W * zoom, panX));
    panY = Math.min(0, Math.max(H - H * zoom, panY));
  }

  function toWorld(cx, cy) {
    return { x: (cx - panX) / zoom, y: (cy - panY) / zoom };
  }

  function syncResetBtn() {
    if (!resetBtn) return;
    const zoomed = zoom > 1.01;
    resetBtn.classList.toggle('visible', zoomed);
    resetBtn.tabIndex = zoomed ? 0 : -1;
    resetBtn.style.top = `${canvas.offsetTop + 10}px`;
  }

  function resetView() {
    zoom = 1; panX = 0; panY = 0;
    syncResetBtn();
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateScale();
    nodes.forEach(n => { n.r = nodeRadius(n); });
    clampView();
    syncResetBtn();
    simActive = true;
  }

  function savePositions() {
    try {
      const data = {};
      nodes.forEach(n => { data[n.id] = { x: Math.round(n.x), y: Math.round(n.y) }; });
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function loadPositions() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  /* ==========================================================================
     4. Graph Construction & Position Cache
     Restores positions from localStorage or computes initial circular spread
     ========================================================================== */
  function buildGraph() {
    const saved = loadPositions();
    const nodeMap = {};

    nodes = NODES_DATA.map((d, i) => {
      const angle  = (i / NODES_DATA.length) * Math.PI * 2;
      const radius = d.group === 'center' ? 0 : (180 + Math.random() * 60) * layoutK;
      const defaultX = W / 2 + Math.cos(angle) * radius;
      const defaultY = H / 2 + Math.sin(angle) * radius;

      const pos = saved && saved[d.id];
      const node = {
        ...d,
        x:  pos ? pos.x : defaultX,
        y:  pos ? pos.y : defaultY,
        vx: 0,
        vy: 0,
        r:  nodeRadius(d),
      };
      nodeMap[d.id] = node;
      return node;
    });

    links = LINKS_DATA.map(([a, b]) => ({
      source: nodeMap[a],
      target: nodeMap[b],
      solid:  isSolidLink(a, b),
    })).filter(l => l.source && l.target);
  }

  function loadImages(cb) {
    const srcs = [...new Set(NODES_DATA.map(d => d.image).filter(Boolean))];
    imagesTotal = srcs.length;
    if (imagesTotal === 0) { cb(); return; }

    srcs.forEach(src => {
      const img = new Image();
      img.onload  = () => { imagesLoaded++; if (imagesLoaded >= imagesTotal) cb(); };
      img.onerror = () => { imagesLoaded++; if (imagesLoaded >= imagesTotal) cb(); };
      img.src = src;
      images[src] = img;
    });
  }

  /* ==========================================================================
     5. Physics Simulation Step (Springs & Repulsion)
     ========================================================================== */
  function tick() {
    let maxV = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        if (a === dragNode || b === dragNode) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist2 = dx * dx + dy * dy || 1;
        const dist  = Math.sqrt(dist2);
        const force = (REPULSION * layoutK * layoutK) / dist2;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }

    links.forEach(({ source: a, target: b }) => {
      const dx   = b.x - a.x;
      const dy   = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const dragging = (a === dragNode || b === dragNode);
      const rest = (dragging ? SPRING_LEN * 1.55 : SPRING_LEN) * layoutK;
      const k    = dragging ? SPRING_K * 0.55 : SPRING_K;
      const diff = dist - rest;
      const fx   = (dx / dist) * diff * k;
      const fy   = (dy / dist) * diff * k;
      if (a !== dragNode) { a.vx += fx; a.vy += fy; }
      if (b !== dragNode) { b.vx -= fx; b.vy -= fy; }
    });

    if (dragNode) {
      nodes.forEach(n => {
        if (n === dragNode) return;
        const dx = n.x - dragNode.x;
        const dy = n.y - dragNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minD = dragNode.r + n.r + 36 * layoutK;
        if (dist < minD) {
          const push = (minD - dist) * 0.08;
          n.vx += (dx / dist) * push;
          n.vy += (dy / dist) * push;
        }
      });
    }

    nodes.forEach(n => {
      if (n === dragNode) return;

      const safeW = W * 0.44;
      const safeH = H * 0.44;
      const cx = W / 2, cy = H / 2;
      const dx = n.x - cx, dy = n.y - cy;
      if (Math.abs(dx) > safeW) n.vx -= (dx - Math.sign(dx) * safeW) * 0.0005;
      if (Math.abs(dy) > safeH) n.vy -= (dy - Math.sign(dy) * safeH) * 0.0005;

      n.vx *= DAMPING;
      n.vy *= DAMPING;
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (spd > MAX_SPEED) { n.vx = (n.vx / spd) * MAX_SPEED; n.vy = (n.vy / spd) * MAX_SPEED; }
      n.x += n.vx;
      n.y += n.vy;
      const m = n.r + 8;
      if (n.x < m)     { n.x = m;     n.vx =  Math.abs(n.vx) * 0.4; }
      if (n.x > W - m) { n.x = W - m; n.vx = -Math.abs(n.vx) * 0.4; }
      if (n.y < m)     { n.y = m;     n.vy =  Math.abs(n.vy) * 0.4; }
      if (n.y > H - m) { n.y = H - m; n.vy = -Math.abs(n.vy) * 0.4; }
      maxV = Math.max(maxV, Math.abs(n.vx), Math.abs(n.vy));
    });

    if (maxV < SETTLE_VEL && !dragNode) simActive = false;
  }

  function drawAvatarCircle(node) {
    const { x, y, r } = node;
    const src = node.image;
    const img = src ? images[src] : null;
    const isReady = img && img.complete && img.naturalWidth > 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    if (isReady) {
      if (node.darkBg) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fill();
        const pad = r * 0.2;
        const size = (r - pad) * 2;
        ctx.drawImage(img, x - r + pad, y - r + pad, size, size);
      } else {
        ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
      }
    } else {
      ctx.fillStyle = GROUP_COLOURS[node.group] || '#888';
      ctx.fill();
      ctx.fillStyle = '#0c0c0c';
      ctx.font = `bold ${Math.max(8, r * 0.45)}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = node.name.split(/[\s\/]/)[0];
      ctx.fillText(label.substring(0, 4), x, y);
    }

    ctx.restore();
  }

  /* ==========================================================================
     6. Canvas Render Routine
     Draws edge links, avatar circles, borders, and center labels
     ========================================================================== */
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, dpr * panX, dpr * panY);

    links.forEach(({ source: a, target: b, solid }) => {
      const isHoverLink = hoveredNode && (hoveredNode === a || hoveredNode === b);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.setLineDash(solid ? [] : [4, 5]);
      if (solid) {
        ctx.strokeStyle = isHoverLink ? 'rgba(242,240,235,0.5)' : 'rgba(242,240,235,0.24)';
        ctx.lineWidth   = isHoverLink ? 1.5 : 1.1;
      } else {
        ctx.strokeStyle = isHoverLink ? 'rgba(242,240,235,0.4)' : 'rgba(242,240,235,0.16)';
        ctx.lineWidth   = isHoverLink ? 1.2 : 0.8;
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    nodes.forEach(node => {
      const isHovered = node === hoveredNode;
      const r = node.r;

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(242,240,235,0.12)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? (GROUP_COLOURS[node.group] || '#888') : 'rgba(242,240,235,0.18)';
      ctx.fill();

      drawAvatarCircle(node);

      if (node.group === 'center' || !simActive || isHovered) {
        ctx.font = `${node.group === 'center' ? 700 : 400} ${(node.group === 'center' ? 11 : 10) / zoom}px "Space Mono", monospace`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle    = node.group === 'center' ? 'rgba(242,240,235,0.95)' : 'rgba(242,240,235,0.6)';
        ctx.fillText(node.name, node.x, node.y + r + 5 / zoom);
      }
    });
  }

  function loop() {
    animId = requestAnimationFrame(loop);
    if (simActive || dragNode) tick();
    draw();
  }

  /* ==========================================================================
     7. Interaction Handlers: Dragging, Hover, & Tooltips
     ========================================================================== */
  let lastTouchTime = 0;   // used to ignore the mouse events browsers emulate after a tap
  const recentTouch = () => Date.now() - lastTouchTime < 800;
  let hitSlop = 6;   // larger touch target while a finger is on the canvas
  function hitNode(cx, cy) {
    const w = toWorld(cx, cy);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = w.x - n.x, dy = w.y - n.y;
      const slop = hitSlop / zoom;
      if (dx * dx + dy * dy <= (n.r + slop) * (n.r + slop)) return n;
    }
    return null;
  }

  function showTooltip(node, sx, sy) {
    ttName.textContent = node.name;
    ttRole.textContent = roleLabel(node);
    if (window.innerWidth <= 900) {
      const half = (tooltip.offsetWidth || 120) / 2 + 8;
      sx = Math.min(Math.max(sx, half), window.innerWidth - half);
    }
    tooltip.style.left = `${sx}px`;
    tooltip.style.top  = `${sy}px`;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }


  const section = document.getElementById('connections-section');

  function suppressCursor(on) {
    if (window.the0dllCursor) window.the0dllCursor.suppressed = on;
  }

  function isInCursorZone(clientX, clientY) {
    if (!section) return false;
    const r = section.getBoundingClientRect();
    return (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top + 12 &&
      clientY <= r.bottom
    );
  }

  window.addEventListener('mousemove', e => {
    if (recentTouch()) return;
    suppressCursor(isInCursorZone(e.clientX, e.clientY) || !!dragNode);

    if (dragNode) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      dragNode.x  = cx + dragOffX;
      dragNode.y  = cy + dragOffY;
      dragNode.vx = 0;
      dragNode.vy = 0;
      simActive = true;
      if (!loopRunning) { loopRunning = true; loop(); }
      showTooltip(dragNode, e.clientX, e.clientY);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const insideCanvas =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;

    if (!insideCanvas) {
      if (hoveredNode) { hoveredNode = null; hideTooltip(); }
      return;
    }

    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const hit = hitNode(cx, cy);
    if (hit !== hoveredNode) {
      hoveredNode = hit;
      canvas.style.cursor = hit ? 'pointer' : 'grab';
    }
    if (hit) { showTooltip(hit, e.clientX, e.clientY); }
    else      { hideTooltip(); }
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    if (!dragNode) {
      hoveredNode = null;
      hideTooltip();
      canvas.style.cursor = 'grab';
    }
  });

  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0 || recentTouch()) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const hit = hitNode(cx, cy);
    if (hit) {
      dragNode = hit;
      dragOffX = hit.x - cx;
      dragOffY = hit.y - cy;
      hit.vx = 0;
      hit.vy = 0;
      canvas.style.cursor = 'grabbing';
      simActive = true;
      if (!loopRunning) { loopRunning = true; loop(); }
      e.preventDefault();
    }
  });

  window.addEventListener('mouseup', e => {
    if (!dragNode) return;
    dragNode.vx = (Math.random() - 0.5) * 0.5;
    dragNode.vy = (Math.random() - 0.5) * 0.5;
    dragNode = null;
    simActive = true;
    savePositions();
    suppressCursor(isInCursorZone(e.clientX, e.clientY));
    const rect = canvas.getBoundingClientRect();
    const insideCanvas =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (!insideCanvas) hideTooltip();
    canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
  });

  let tipTimer = null;

  function touchPoint(t, rect) {
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  function beginPinch(e) {
    const rect = canvas.getBoundingClientRect();
    const a = touchPoint(e.touches[0], rect), b = touchPoint(e.touches[1], rect);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    pinch = {
      dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      zoom,
      wx: (mx - panX) / zoom,   // world point under the fingers' midpoint
      wy: (my - panY) / zoom,
    };
    hideTooltip();
  }

  canvas.addEventListener('touchstart', e => {
    lastTouchTime = Date.now();
    clearTimeout(tipTimer);

    if (e.touches.length >= 2 && zoomEnabled()) {
      // Second finger: cancel any node drag and start a pinch
      if (dragNode) {
        dragNode.vx = 0; dragNode.vy = 0;
        dragNode = null;
        simActive = true;
      }
      beginPinch(e);
      return;
    }

    hitSlop = 9;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const p = touchPoint(t, rect);
    const hit = hitNode(p.x, p.y);
    if (hit) {
      const w = toWorld(p.x, p.y);
      dragNode = hit;
      dragOffX = hit.x - w.x;
      dragOffY = hit.y - w.y;
      hit.vx = 0;
      hit.vy = 0;
      simActive = true;
      if (!loopRunning) { loopRunning = true; loop(); }
      showTooltip(hit, t.clientX, t.clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (pinch && e.touches.length >= 2) {
      const rect = canvas.getBoundingClientRect();
      const a = touchPoint(e.touches[0], rect), b = touchPoint(e.touches[1], rect);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, pinch.zoom * (dist / pinch.dist)));
      // keep the pinched world point under the (moving) midpoint: zoom + two-finger pan
      panX = mx - pinch.wx * zoom;
      panY = my - pinch.wy * zoom;
      clampView();
      syncResetBtn();
      e.preventDefault();
      return;
    }
    if (pinch || !dragNode) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const w = toWorld(t.clientX - rect.left, t.clientY - rect.top);
    dragNode.x  = w.x + dragOffX;
    dragNode.y  = w.y + dragOffY;
    dragNode.vx = 0;
    dragNode.vy = 0;
    simActive = true;
    showTooltip(dragNode, t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });

  function endTouch(e) {
    lastTouchTime = Date.now();
    if (pinch) {
      // pinch ends as soon as fewer than two fingers remain
      if (!e || !e.touches || e.touches.length < 2) pinch = null;
      if (!e || !e.touches || e.touches.length === 0) hitSlop = 6;
      return;
    }
    hitSlop = 6;
    if (dragNode) {
      dragNode.vx = (Math.random() - 0.5) * 0.5;
      dragNode.vy = (Math.random() - 0.5) * 0.5;
      dragNode = null;
      simActive = true;
      savePositions();
      clearTimeout(tipTimer);
      tipTimer = setTimeout(hideTooltip, 1200);
    }
  }
  canvas.addEventListener('touchend', endTouch);
  canvas.addEventListener('touchcancel', endTouch);

  /* Reset-zoom button (created for touch devices only) */
  if (window.matchMedia('(pointer: coarse)').matches) {
    resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'conn-zoom-reset';
    resetBtn.textContent = '1:1';
    resetBtn.tabIndex = -1;
    const label = () => (window.I18N ? window.I18N.t('conn.reset_zoom') : 'Reset zoom');
    resetBtn.setAttribute('aria-label', label());
    window.addEventListener('langchange', () => resetBtn.setAttribute('aria-label', label()));
    resetBtn.addEventListener('click', resetView);
    canvas.parentNode.appendChild(resetBtn);
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible && !loopRunning) {
      loopRunning = true;
      loop();
    } else if (!visible && loopRunning) {
      loopRunning = false;
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });

  /* ==========================================================================
     8. Initialization & Lifecycle
     ========================================================================== */
  function init() {
    resize();
    buildGraph();
    observer.observe(canvas);
  }

  loadImages(init);

  window.addEventListener('langchange', () => {
    try {
      if (hoveredNode && tooltip.classList.contains('visible')) {
        ttRole.textContent = roleLabel(hoveredNode);
      }
      draw();
    } catch (_) {}
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      simActive = true;
    }, 200);
  });


})();

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const NS = 'http://www.w3.org/2000/svg';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function tok(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgba(hex, alpha) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// small diamond network: input branches two ways, converges, then a hub -> output
const NODES = [
  { x: 55, y: 240 },  // 0 input
  { x: 175, y: 105 }, // 1
  { x: 175, y: 375 }, // 2
  { x: 320, y: 240 }, // 3 hub
  { x: 430, y: 240 }, // 4 output
];
const LINKS = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
const TOKEN_PATH = [0, 1, 3, 4, 3, 2, 0]; // full loop, touches every node + both branches

function initHero() {
  const canvas = document.querySelector('.hero-particles');
  const svg = document.querySelector('.hero-network');
  if (!canvas || !svg) return;

  const ctx = canvas.getContext('2d');
  const linksG = svg.querySelector('.hn-links');
  const nodesG = svg.querySelector('.hn-nodes');
  const fxG = svg.querySelector('.hn-fx');
  const PALETTE = ['--gen', '--ind', '--prod', '--client', '--claims'].map(tok);

  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let running = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.max(1, W * DPR);
    canvas.height = Math.max(1, H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seedParticles() {
    const count = REDUCED_MOTION ? 0 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      baseAlpha: 0.08 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function tickParticles(deltaMs) {
    if (!running || !W || !H) return;
    const dt = Math.min(deltaMs / 1000, 0.05);
    ctx.clearRect(0, 0, W, H);
    const color = tok('--muted') || '#6B6963';
    for (const p of particles) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
      p.phase += dt * 0.6;
      const a = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(color, a);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function buildNetwork() {
    const rule = tok('--rule') || '#DEDBD3';
    LINKS.forEach(([a, b]) => {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', NODES[a].x); line.setAttribute('y1', NODES[a].y);
      line.setAttribute('x2', NODES[b].x); line.setAttribute('y2', NODES[b].y);
      line.setAttribute('stroke', rule);
      line.setAttribute('stroke-width', '2');
      linksG.appendChild(line);
    });

    const halos = NODES.map((n, i) => {
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', n.x); halo.setAttribute('cy', n.y);
      halo.setAttribute('r', 8);
      halo.setAttribute('fill', PALETTE[i % PALETTE.length]);
      halo.setAttribute('opacity', '0');
      fxG.appendChild(halo);
      return halo;
    });

    NODES.forEach((n, i) => {
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', n.x); dot.setAttribute('cy', n.y);
      dot.setAttribute('r', 7);
      dot.setAttribute('fill', PALETTE[i % PALETTE.length]);
      nodesG.appendChild(dot);
    });

    const token = document.createElementNS(NS, 'circle');
    token.setAttribute('class', 'hn-token');
    token.setAttribute('r', 6);
    token.setAttribute('fill', tok('--ink') || '#1C1B19');
    token.setAttribute('cx', NODES[0].x);
    token.setAttribute('cy', NODES[0].y);
    fxG.appendChild(token);

    return { token, halos };
  }

  function pulseNode(idx, halos) {
    gsap.fromTo(
      halos[idx],
      { attr: { r: 8 }, opacity: 0.55 },
      { attr: { r: 34 }, opacity: 0, duration: 0.8, ease: 'power2.out' }
    );
  }

  function spawnRadiateBurst(fromIdx) {
    const origin = NODES[fromIdx];
    const claims = tok('--claims') || '#5B3B78';
    [-60, -20, 20, 60].forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const dist = 95 + Math.random() * 25;
      const midX = origin.x + Math.cos(rad) * dist * 0.55;
      const midY = origin.y + Math.sin(rad) * dist * 0.55 - 18;
      const endX = origin.x + Math.cos(rad) * dist;
      const endY = origin.y + Math.sin(rad) * dist;
      const pathStr = `M${origin.x},${origin.y} Q${midX},${midY} ${endX},${endY}`;

      const particle = document.createElementNS(NS, 'circle');
      particle.setAttribute('class', 'hn-burst');
      particle.setAttribute('r', '3.5');
      particle.setAttribute('fill', claims);
      particle.setAttribute('cx', '0');
      particle.setAttribute('cy', '0');
      fxG.appendChild(particle);

      gsap.fromTo(
        particle,
        { x: origin.x, y: origin.y, opacity: 1 },
        {
          motionPath: { path: pathStr, autoRotate: false },
          opacity: 0,
          duration: 1.15,
          ease: 'power1.out',
          onComplete: () => particle.remove(),
        }
      );
    });
  }

  function buildTimeline(token, halos) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true });
    for (let i = 1; i < TOKEN_PATH.length; i++) {
      const nodeIdx = TOKEN_PATH[i];
      const to = NODES[nodeIdx];
      tl.to(token, { attr: { cx: to.x, cy: to.y }, duration: 0.65, ease: 'power2.inOut' })
        .call(() => {
          pulseNode(nodeIdx, halos);
          if (nodeIdx === 4) spawnRadiateBurst(4);
        });
    }
    return tl;
  }

  function setRunning(v) {
    if (running === v) return;
    running = v;
    if (REDUCED_MOTION) return; // stay static: network renders once, nothing moves or loops
    if (v) {
      resizeCanvas();
      if (!particles.length) seedParticles();
      timeline.play();
    } else {
      timeline.pause();
    }
  }

  seedParticles();
  const { token, halos } = buildNetwork();
  const timeline = buildTimeline(token, halos);

  gsap.ticker.add((time, deltaMs) => tickParticles(deltaMs));
  window.addEventListener('resize', () => { if (running) resizeCanvas(); });

  function checkSlide() {
    const current = window.Reveal.getCurrentSlide && window.Reveal.getCurrentSlide();
    setRunning(!!(current && current.classList.contains('title-slide')));
  }
  window.Reveal.on('slidechanged', checkSlide);
  checkSlide();
}

function boot() {
  if (!window.Reveal) return;
  if (window.Reveal.isReady && window.Reveal.isReady()) initHero();
  else window.Reveal.on('ready', initHero);
}

boot();

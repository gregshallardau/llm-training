import gsap from 'gsap';

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

// A lightweight ambient drifting-particle field on a <canvas>, driven by gsap.ticker.
// Call .start() when the host slide becomes current, .stop() when it doesn't.
export function createParticleField(canvas, opts = {}) {
  const count = REDUCED_MOTION ? 0 : (opts.count ?? 70);
  const colorVar = opts.colorVar || '--muted';
  const speed = opts.speed ?? 8;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let running = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.max(1, W * DPR);
    canvas.height = Math.max(1, H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      baseAlpha: 0.08 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function tick(deltaMs) {
    if (!running || !W || !H) return;
    const dt = Math.min(deltaMs / 1000, 0.05);
    ctx.clearRect(0, 0, W, H);
    const color = tok(colorVar) || '#6B6963';
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

  gsap.ticker.add((time, deltaMs) => tick(deltaMs));

  return {
    start() {
      if (running) return;
      running = true;
      resize();
      if (!particles.length) seed();
    },
    stop() {
      running = false;
    },
    resize() {
      if (running) resize();
    },
  };
}

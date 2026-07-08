/* Native interactive visuals — real DOM/SVG, theme-aware (colour read from CSS
   tokens), no iframes, no runtime chart dependency (P7). Re-mounted on theme
   change so they re-read tokens. */
import { el } from './util.js';
import { registerVisual } from './registry.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  return n;
};
const tok = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const palette = () => [tok('--brand'), tok('--brand-2'), tok('--accent-green'), tok('--accent-warm')];

registerVisual('chart', (host, props) => {
  const { type = 'bar', labels = [], data = [], title, sub } = props;
  const ink = tok('--text-muted'), grid = tok('--border'), accent = palette()[0];

  const wrap = el('div.dk-chart', null,
    (title || sub) && el('div.dk-chart-head', null,
      title && el('h2', null, title),
      sub && el('p.dk-muted', null, sub)
    )
  );
  const box = el('div.dk-chart-box');
  wrap.append(box);

  const W = 1000, H = 500, PL = 56, PB = 42, PT = 12, PR = 12;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', role: 'img', 'aria-label': title || 'chart' });
  const max = Math.max(1, ...data);
  const plotW = W - PL - PR, plotH = H - PT - PB;
  const y = (v) => PT + plotH * (1 - v / max);

  // gridlines + y labels (4 ticks)
  for (let t = 0; t <= 4; t++) {
    const v = (max / 4) * t, yy = y(v);
    svg.append(svgEl('line', { x1: PL, y1: yy, x2: W - PR, y2: yy, stroke: grid, 'stroke-width': 1 }));
    const lab = svgEl('text', { x: PL - 10, y: yy + 4, 'text-anchor': 'end', fill: ink, 'font-size': 16 });
    lab.textContent = Math.round(v).toLocaleString();
    svg.append(lab);
  }
  const readout = el('span.dk-chart-read');

  if (type === 'line') {
    const step = plotW / Math.max(1, data.length - 1);
    const pts = data.map((v, i) => `${PL + i * step},${y(v)}`).join(' ');
    svg.append(svgEl('polyline', { points: pts, fill: 'none', stroke: accent, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    data.forEach((v, i) => {
      const c = svgEl('circle', { cx: PL + i * step, cy: y(v), r: 5, fill: accent });
      c.addEventListener('mouseenter', () => { readout.textContent = `${labels[i] ?? i}: ${v.toLocaleString()}`; });
      svg.append(c);
    });
  } else {
    const n = data.length, gap = plotW / n * 0.28, bw = plotW / n - gap;
    data.forEach((v, i) => {
      const bx = PL + i * (bw + gap) + gap / 2, bh = plotH * (v / max);
      const r = svgEl('rect', { x: bx, y: PT + plotH - bh, width: bw, height: bh, rx: 4, fill: accent });
      r.addEventListener('mouseenter', () => { readout.textContent = `${labels[i] ?? i}: ${v.toLocaleString()}`; });
      svg.append(r);
    });
  }
  // x labels
  const n = data.length, slot = plotW / n;
  labels.forEach((l, i) => {
    const t = svgEl('text', { x: (type === 'line' ? PL + i * (plotW / Math.max(1, n - 1)) : PL + i * slot + slot / 2), y: H - PB + 24, 'text-anchor': 'middle', fill: ink, 'font-size': 16 });
    t.textContent = l;
    svg.append(t);
  });

  box.append(svg);
  wrap.append(el('div.dk-chart-legend', null,
    el('span.dk-swatch', { style: { background: accent } }), el('span', null, props.seriesLabel || 'Series'), readout));
  host.append(wrap);
  return () => host.replaceChildren();
});

registerVisual('donut', (host, props) => {
  const { title, sub, segments = [] } = props;
  const colors = palette();
  const total = segments.reduce((a, s) => a + (s.value || 0), 0) || 1;
  const size = 280, cx = size / 2, cy = size / 2, r = 100, thick = 40, C = 2 * Math.PI * r;

  const wrap = el('div.dk-donut', null,
    (title || sub) && el('div.dk-chart-head', null, title && el('h2', null, title), sub && el('p.dk-muted', null, sub)));
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: '100%', height: '100%', role: 'img', 'aria-label': title || 'donut chart' });
  let acc = 0;
  segments.forEach((s, i) => {
    const len = (s.value || 0) / total * C;
    svg.append(svgEl('circle', {
      cx, cy, r, fill: 'none', stroke: colors[i % colors.length], 'stroke-width': thick,
      'stroke-dasharray': `${len} ${C - len}`, 'stroke-dashoffset': -acc, transform: `rotate(-90 ${cx} ${cy})`
    }));
    acc += len;
  });
  const centre = svgEl('text', { x: cx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: tok('--text'), 'font-size': 36, 'font-weight': 700 });
  centre.textContent = String(total);
  svg.append(centre);

  const legend = el('div.dk-donut-legend', null, segments.map((s, i) =>
    el('div.dk-legend-item', null,
      el('span.dk-swatch', { style: { background: colors[i % colors.length] } }),
      el('span', null, s.label), el('span.dk-legend-val', null, String(s.value)))));

  wrap.append(el('div.dk-donut-row', null, el('div.dk-donut-svg', null, svg), legend));
  host.append(wrap);
  return () => host.replaceChildren();
});

registerVisual('image', (host, props) => {
  const { src, fit = 'cover', focal = 'center', scrim, alt = '' } = props;
  const bg = el('div.dk-img', { role: 'img', 'aria-label': alt, 'data-fit': fit });
  if (src) { bg.style.backgroundImage = `url("${src}")`; bg.style.backgroundPosition = focal; }
  else bg.setAttribute('data-empty', 'Picture — set src');
  host.append(bg);
  if (scrim) host.append(el('div.dk-scrim', { 'data-scrim': scrim }));
  return () => host.replaceChildren();
});

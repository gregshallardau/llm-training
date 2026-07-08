/* Content blocks — static, token-driven DOM built from declared props. */
import { el } from './util.js';
import { registerBlock } from './registry.js';

registerBlock('cards', (p) =>
  el('div.dk-cards', null, (p.items || []).map((it) =>
    el('div.dk-card', null,
      it.title && el('h3', null, it.title),
      it.body && el('p', null, it.body)
    )
  ))
);

registerBlock('flow', (p) => {
  const steps = p.steps || [];
  const nodes = [];
  steps.forEach((s, i) => {
    nodes.push(el('div.dk-step', null, s.title && el('h4', null, s.title), s.body && el('p', null, s.body)));
    if (i < steps.length - 1) nodes.push(el('div.dk-arrow', null, '→'));
  });
  return el('div.dk-flow', null, nodes);
});

registerBlock('callout', (p) =>
  el('div.dk-callout', { 'data-tone': p.tone || 'brand' },
    p.title && el('h3', null, p.title),
    p.body && el('p', null, p.body)
  )
);

registerBlock('stats', (p) =>
  el('div.dk-stats', null, (p.items || []).map((it) =>
    el('div.dk-stat', null,
      el('div.dk-stat-val', null, it.value),
      it.label && el('div.dk-stat-label', null, it.label))))
);

registerBlock('list', (p) =>
  el('ul.dk-list', null, (p.items || []).map((i) => el('li', null, i)))
);

registerBlock('code', (p) =>
  el('pre.dk-code', null, el('code', { class: `language-${p.lang || 'text'}` }, p.code || ''))
);

registerBlock('timeline', (p) =>
  el('ol.dk-timeline', null, (p.items || []).map((it) =>
    el('li.dk-tl-item', null,
      el('div.dk-tl-dot'),
      el('div.dk-tl-body', null, it.title && el('h4', null, it.title), it.body && el('p', null, it.body)))))
);

function sparkline(values) {
  const w = 128, h = 34, max = Math.max(...values), min = Math.min(...values), rng = (max - min) || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / rng) * (h - 4) - 2}`).join(' ');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('class', 'dk-spark');
  const pl = document.createElementNS(ns, 'polyline'); pl.setAttribute('points', pts);
  pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', 'currentColor'); pl.setAttribute('stroke-width', '2');
  pl.setAttribute('stroke-linecap', 'round'); pl.setAttribute('stroke-linejoin', 'round');
  svg.append(pl); return svg;
}
registerBlock('kpi', (p) =>
  el('div.dk-kpis', null, (p.items || []).map((it) => {
    const up = typeof it.delta === 'number' ? it.delta >= 0 : String(it.delta || '').trim().startsWith('+');
    return el('div.dk-kpi', null,
      el('div.dk-kpi-val', null, it.value),
      it.label && el('div.dk-kpi-label', null, it.label),
      it.delta != null && el('div.dk-kpi-delta', { 'data-dir': up ? 'up' : 'down' }, `${up ? '▲' : '▼'} ${it.delta}`),
      Array.isArray(it.spark) && it.spark.length > 1 && sparkline(it.spark));
  }))
);

registerBlock('table', (p) =>
  el('table.dk-table', null,
    p.columns && el('thead', null, el('tr', null, p.columns.map((c) => el('th', null, c)))),
    el('tbody', null, (p.rows || []).map((r) => el('tr', null, r.map((cell) => el('td', null, cell)))))
  )
);

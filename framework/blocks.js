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

registerBlock('table', (p) =>
  el('table.dk-table', null,
    p.columns && el('thead', null, el('tr', null, p.columns.map((c) => el('th', null, c)))),
    el('tbody', null, (p.rows || []).map((r) => el('tr', null, r.map((cell) => el('td', null, cell)))))
  )
);

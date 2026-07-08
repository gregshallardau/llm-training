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

registerBlock('table', (p) =>
  el('table.dk-table', null,
    p.columns && el('thead', null, el('tr', null, p.columns.map((c) => el('th', null, c)))),
    el('tbody', null, (p.rows || []).map((r) => el('tr', null, r.map((cell) => el('td', null, cell)))))
  )
);

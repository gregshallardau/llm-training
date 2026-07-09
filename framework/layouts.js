/* Layouts — the fixed vocabulary authors choose from. Each is
   render(slideData, ctx) -> { mode: 'flow' | 'bleed', node }.
   'flow' content is wrapped in .fit-inner (shrink-to-fit); 'bleed' fills the frame. */
import { el } from './util.js';
import { registerLayout, getBlock } from './registry.js';

// a deferred visual mount point; index.js mounts these once attached & sized
export function visualHost(spec) {
  const host = el('div.dk-visual-host');
  host.__visual = spec;
  return host;
}
const buildBlocks = (blocks = []) =>
  blocks.map((b) => { const fn = getBlock(b.type); return fn ? fn(b) : el('div', null, `[unknown block: ${b.type}]`); });

registerLayout('title', (d) => ({
  mode: 'flow',
  node: el('div.dk-title', null,
    d.eyebrow && el('div.dk-eyebrow', null, d.eyebrow),
    el('h1', null, d.heading),
    d.subhead && el('p.dk-lead', null, d.subhead)
  )
}));

registerLayout('content', (d) => {
  const body = d.depths
    ? el('div.dk-layers', { role: 'group', 'aria-label': 'Depth' },
        Object.entries(d.depths).map(([level, spec]) =>
          el('div.dk-depth', { 'data-depth': level }, buildBlocks(spec.blocks))))
    : buildBlocks(d.blocks);
  return { mode: 'flow', node: el('div.dk-content', null, d.heading && el('h2', null, d.heading), body) };
});

registerLayout('split', (d) => ({
  mode: 'flow',
  node: el('div.dk-split', { 'data-media': d.mediaSide || 'right' },
    el('div.dk-split-text', null,
      d.text?.heading && el('h2', null, d.text.heading),
      d.text?.body && el('p', null, d.text.body)),
    el('div.dk-split-media', null, visualHost(d.media || {}))
  )
}));

registerLayout('image', (d) => ({
  mode: 'bleed',
  node: el('div.dk-fill', null,
    visualHost({ component: 'image', src: d.src, fit: d.fit, focal: d.focal, scrim: d.scrim, alt: d.alt }),
    el('div.dk-figtext', null,
      d.eyebrow && el('div.dk-eyebrow.on-media', null, d.eyebrow),
      d.heading && el('h2', null, d.heading),
      d.body && el('p', null, d.body))
  )
}));

registerLayout('visual', (d) => ({
  mode: 'bleed',
  node: el('div.dk-fill', null, visualHost({ component: d.component, ...(d.props || {}) }))
}));

registerLayout('quote', (d) => ({
  mode: 'flow',
  node: el('div.dk-quote', null,
    el('p.dk-bigquote', { html: d.text }),
    d.cite && el('p.dk-cite', null, d.cite))
}));

registerLayout('section', (d) => ({
  mode: 'flow',
  node: el('div.dk-section', null,
    d.kicker && el('div.dk-eyebrow', null, d.kicker),
    el('h1', null, d.heading),
    d.subhead && el('p.dk-lead', null, d.subhead))
}));

registerLayout('statement', (d) => ({
  mode: 'flow',
  node: el('div.dk-statement', null, el('p.dk-bigstate', { html: d.text }))
}));

registerLayout('grid', (d) => ({
  mode: 'flow',
  node: el('div.dk-content', null,
    d.heading && el('h2', null, d.heading),
    el('div.dk-grid', { style: { '--cols': String(d.columns || 2) } }, buildBlocks(d.blocks)))
}));

registerLayout('compare', (d) => {
  const col = (c, tone) => el('div.dk-compare-col', { 'data-tone': tone },
    c?.title && el('h4', null, c.title),
    el('ul', null, (c?.items || []).map((i) => el('li', null, i))));
  return {
    mode: 'flow',
    node: el('div.dk-content', null,
      d.heading && el('h2', null, d.heading),
      el('div.dk-compare', null, col(d.left, 'neg'), col(d.right, 'pos')))
  };
});

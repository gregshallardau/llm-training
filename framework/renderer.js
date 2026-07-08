/* Deck config → reveal slides. Each slide becomes a <section> with the fit
   structure; layout output goes in .fit-inner (flow) or fills .fit (bleed).
   Speaker notes become <aside class="notes"> for the presenter window. */
import { el } from './util.js';
import { getLayout } from './registry.js';

export function renderDeck(config, slidesEl) {
  slidesEl.replaceChildren();
  for (const slide of config.slides || []) {
    const section = document.createElement('section');
    const layoutFn = getLayout(slide.layout) || getLayout('content');
    const { mode, node } = layoutFn(slide, {});
    const fit = el('div.fit');
    if (mode === 'bleed') fit.append(node);
    else fit.append(el('div.fit-inner', null, node));
    section.append(fit);
    if (slide.notes) section.append(el('aside.notes', null, slide.notes));
    slidesEl.append(section);
  }
}

/* Framework entry. Registers layouts/blocks/visuals (side effects), renders the
   inlined deck config (window.__DECK__), boots reveal.js with our fit plugin +
   the vendored notes (speaker) plugin, mounts visuals lazily per slide, and wires
   the presenter layer. Bundled by esbuild to a classic script for offline use. */
import './blocks.js';
import './layouts.js';
import './visuals.js';
import { renderDeck } from './renderer.js';
import { fitPlugin } from './fit.js';
import { getVisual } from './registry.js';
import { initPresenter, applyThemeInitial } from './presenter.js';

function mountVisualsIn(slide) {
  if (!slide) return;
  slide.querySelectorAll('.dk-visual-host').forEach((host) => {
    if (host.__mounted) return;
    const spec = host.__visual;
    const fn = spec && spec.component && getVisual(spec.component);
    if (!fn) return;
    host.__dispose = fn(host, spec, {});
    host.__mounted = true;
  });
}
function remountVisualsIn(slide) {
  if (!slide) return;
  slide.querySelectorAll('.dk-visual-host').forEach((host) => {
    if (host.__dispose) try { host.__dispose(); } catch { /* ignore */ }
    host.__mounted = false;
  });
  mountVisualsIn(slide);
}

function boot() {
  applyThemeInitial();
  const deckData = window.__DECK__ || { slides: [] };
  document.title = deckData.title || 'Deck';
  renderDeck(deckData, document.querySelector('.reveal .slides'));

  const plugins = [fitPlugin];
  if (window.RevealNotes) plugins.push(window.RevealNotes);

  window.Reveal.initialize({
    width: 1280, height: 720, margin: 0, minScale: 0.2, maxScale: 2,
    center: false, controls: false, progress: true, hash: true,
    transition: 'fade', transitionSpeed: 'fast', plugins
  });

  const afterShow = (slide) => { mountVisualsIn(slide); window.dispatchEvent(new Event('deck-refit')); };
  window.Reveal.on('ready', (e) => afterShow(e.currentSlide));
  window.Reveal.on('slidechanged', (e) => afterShow(e.currentSlide));

  initPresenter(window.Reveal, { remountVisualsIn });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* Fit layer — guarantees P1 (content never overflows the fixed frame).
   Convention: flow content lives in `.fit-inner` inside a `.fit` frame. We measure
   the inner's natural size in logical-canvas px (unaffected by reveal's outer
   viewport transform → viewport-independent, P13) and scale it down if it exceeds
   the frame. Content that already fits is untouched (scale 1). Full-bleed slides
   have no `.fit-inner` and are skipped. Proven by spikes/fit-layer/. */
export function fitSlide(slide) {
  if (!slide) return;
  const frame = slide.querySelector('.fit');
  const inner = slide.querySelector('.fit-inner');
  if (!frame || !inner) return;
  inner.style.transform = 'none';
  const fw = frame.clientWidth, fh = frame.clientHeight;
  const iw = inner.scrollWidth, ih = inner.scrollHeight;
  if (!fw || !fh || !iw || !ih) return;
  const scale = Math.min(fw / iw, fh / ih, 1);
  inner.style.transformOrigin = 'center center';
  inner.style.transform = scale < 1 ? `scale(${scale})` : 'none';
  inner.dataset.fitScale = scale.toFixed(3);
}

export function fitAll() {
  document.querySelectorAll('.reveal .slides section').forEach(fitSlide);
}

export const fitPlugin = {
  id: 'fit',
  init(deck) {
    deck.on('ready', fitAll);
    deck.on('slidechanged', (e) => fitSlide(e.currentSlide));
    deck.on('resize', () => fitSlide(deck.getCurrentSlide()));
    // other layers (visual mount, theme change) request a re-fit
    window.addEventListener('deck-refit', fitAll);
  }
};

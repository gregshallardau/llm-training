/* Slick minimal chrome: a discreet slide counter (reveal's own arrow controls are
   off; the thin progress bar stays), plus auto-hiding controls. The theme/brand
   buttons and counter fade out when idle and reappear on pointer or keyboard
   activity — so nothing floats over slide content at rest (P10), the way video
   players and reveal's own controls behave. */
export function initChrome(deck) {
  const counter = document.createElement('div');
  counter.id = 'deck-counter';
  document.body.append(counter);
  const update = () => {
    const past = typeof deck.getSlidePastCount === 'function' ? deck.getSlidePastCount() : deck.getIndices().h;
    counter.textContent = `${past + 1} / ${deck.getTotalSlides()}`;
  };
  deck.on('ready', update);
  deck.on('slidechanged', update);

  // auto-hide chrome after a spell of inactivity; wake on any input
  const IDLE_MS = 2600;
  let timer = null;
  const sleep = () => document.body.classList.add('dk-idle');
  const wake = () => {
    document.body.classList.remove('dk-idle');
    clearTimeout(timer);
    timer = setTimeout(sleep, IDLE_MS);
  };
  ['pointermove', 'pointerdown', 'keydown', 'wheel'].forEach((ev) =>
    window.addEventListener(ev, wake, { passive: true }));
  wake(); // show briefly on load, then fade
}

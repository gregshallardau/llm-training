/* Slick minimal chrome: a discreet slide counter (reveal's own arrow controls are
   off; the thin progress bar stays). */
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
}

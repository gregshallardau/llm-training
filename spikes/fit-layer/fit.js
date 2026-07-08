/* Fit-layer proof-of-concept (throwaway).
   A reveal.js plugin that GUARANTEES P1: content never overflows the fixed slide
   frame. Convention: a slide's content lives in `.fit-inner` inside a `.fit` frame.
   The plugin measures the inner's natural size (layout px, unaffected by reveal's
   canvas→viewport transform, so it's viewport-independent → P13) and, if it exceeds
   the frame, scales it down (auto-shrink). Content that already fits is untouched
   (author-to-fit, scale = 1). */
window.FitPlugin = {
  id: 'fit',
  init: function (deck) {
    function fit(slide) {
      if (!slide) return;
      var frame = slide.querySelector('.fit');
      var inner = slide.querySelector('.fit-inner');
      if (!frame || !inner) return;
      inner.style.transform = 'none';           // reset before measuring
      var fw = frame.clientWidth, fh = frame.clientHeight;
      var iw = inner.scrollWidth, ih = inner.scrollHeight;
      if (!fw || !fh || !iw || !ih) return;
      var scale = Math.min(fw / iw, fh / ih, 1); // never upscale
      inner.style.transformOrigin = 'center center';
      inner.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';
      inner.setAttribute('data-fit-scale', scale.toFixed(3));
    }
    function fitAll() { document.querySelectorAll('.reveal .slides section').forEach(fit); }

    deck.on('ready', function () { fitAll(); });
    deck.on('slidechanged', function (e) { fit(e.currentSlide); });
    deck.on('resize', function () { fit(deck.getCurrentSlide()); });
    // re-fit when the theme changes (content metrics can shift)
    window.addEventListener('deck-theme', function () { fitAll(); });
  }
};

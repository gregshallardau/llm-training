import gsap from 'gsap';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPipeline() {
  const pipe = document.querySelector('.pipe');
  if (!pipe) return;

  const token = pipe.querySelector('.pipe-token');
  const steps = Array.from(pipe.querySelectorAll('.pipe-stage, .pipe-experts'));
  const section = pipe.closest('section');

  // for a plain stage, the token targets its own center; for the experts row,
  // the token targets the *chosen* expert's center (branching, not the group average)
  function targetEl(step) {
    if (step.classList.contains('pipe-experts')) {
      const chosenIdx = Number(step.dataset.chosen || 0);
      return step.querySelector(`.pipe-expert[data-idx="${chosenIdx}"]`) || step;
    }
    return step;
  }

  // offsetTop/offsetLeft are relative to the nearest positioned ancestor; for an
  // expert box that's `.pipe-experts` (not `.pipe`), so walk up and add parents' offsets
  // for a normal stage box the token sits centred (there's room around the two-line
  // label); for a narrow expert box that same centring collides with its short label,
  // so the token sits just below the expert row instead
  function centerPosRelativeToPipe(el, opts) {
    let x = 0, y = 0, node = el;
    while (node && node !== pipe) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
      if (!pipe.contains(node)) break;
    }
    const yOffset = opts && opts.below ? el.offsetHeight + 4 : el.offsetHeight / 2 - token.offsetHeight / 2;
    return { x: x + el.offsetWidth / 2 - token.offsetWidth / 2, y: y + yOffset };
  }

  function setActive(step) {
    steps.forEach((s) => {
      if (s.classList.contains('pipe-experts')) {
        const chosenIdx = Number(s.dataset.chosen || 0);
        s.querySelectorAll('.pipe-expert').forEach((ex, i) => {
          ex.classList.toggle('pipe-expert-active', s === step && i === chosenIdx);
        });
      } else {
        s.classList.toggle('pipe-active', s === step);
      }
    });
  }

  function goTo(step, animate) {
    setActive(step);
    const isExperts = step.classList.contains('pipe-experts');
    const { x, y } = centerPosRelativeToPipe(targetEl(step), { below: isExperts });
    if (animate && !REDUCED_MOTION) {
      gsap.to(token, { x, y, duration: 0.5, ease: 'power2.inOut' });
    } else {
      gsap.set(token, { x, y });
    }
  }

  function currentlyShownSteps() {
    // a step with no "fragment" class is always shown; a fragment step counts once reveal has marked it visible
    return steps.filter((s) => !s.classList.contains('fragment') || s.classList.contains('visible'));
  }

  function syncToState(animate) {
    const shown = currentlyShownSteps();
    goTo(shown[shown.length - 1] || steps[0], animate);
  }

  function stepFor(fragmentEl) {
    if (!fragmentEl || !fragmentEl.closest) return null;
    return fragmentEl.closest('.pipe-stage, .pipe-experts');
  }

  function onFragmentShown(e) {
    const step = stepFor(e.fragment);
    if (!step || !steps.includes(step)) return;
    goTo(step, true);
  }

  function onFragmentHidden(e) {
    const step = stepFor(e.fragment);
    if (!step || !steps.includes(step)) return;
    const idx = steps.indexOf(step);
    goTo(steps[Math.max(0, idx - 1)], true);
  }

  window.Reveal.on('fragmentshown', onFragmentShown);
  window.Reveal.on('fragmenthidden', onFragmentHidden);

  // re-sync (no animation) whenever this slide becomes current, e.g. jumping in via overview or a direct link
  window.Reveal.on('slidechanged', (e) => {
    if (e.currentSlide === section) syncToState(false);
  });
  window.addEventListener('resize', () => syncToState(false));

  syncToState(false);
}

function boot() {
  if (!window.Reveal) return;
  if (window.Reveal.isReady && window.Reveal.isReady()) initPipeline();
  else window.Reveal.on('ready', initPipeline);
}

boot();

import gsap from 'gsap';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPipeline() {
  const pipe = document.querySelector('.pipe');
  if (!pipe) return;

  const token = pipe.querySelector('.pipe-token');
  const stages = Array.from(pipe.querySelectorAll('.pipe-stage'));
  const section = pipe.closest('section');

  function stageCenterY(stage) {
    return stage.offsetTop + stage.offsetHeight / 2 - token.offsetHeight / 2;
  }

  function setActive(activeStage) {
    stages.forEach((s) => s.classList.toggle('pipe-active', s === activeStage));
  }

  function goTo(stage, animate) {
    setActive(stage);
    const y = stageCenterY(stage);
    if (animate && !REDUCED_MOTION) {
      gsap.to(token, { y, duration: 0.5, ease: 'power2.inOut' });
    } else {
      gsap.set(token, { y });
    }
  }

  function currentlyShownStages() {
    // a stage with no "fragment" class is always shown; a fragment stage counts once reveal has marked it visible
    return stages.filter((s) => !s.classList.contains('fragment') || s.classList.contains('visible'));
  }

  function syncToState(animate) {
    const shown = currentlyShownStages();
    goTo(shown[shown.length - 1] || stages[0], animate);
  }

  function onFragmentShown(e) {
    const stage = e.fragment && e.fragment.closest && e.fragment.closest('.pipe-stage');
    if (!stage || !stages.includes(stage)) return;
    goTo(stage, true);
  }

  function onFragmentHidden(e) {
    const stage = e.fragment && e.fragment.closest && e.fragment.closest('.pipe-stage');
    if (!stage || !stages.includes(stage)) return;
    const idx = stages.indexOf(stage);
    goTo(stages[Math.max(0, idx - 1)], true);
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

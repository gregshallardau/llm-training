import gsap from 'gsap';
import { createParticleField } from '/particles.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPipeline() {
  const wrap = document.querySelector('.moe-stage-wrap');
  if (!wrap) return;

  const section = wrap.closest('section');
  const canvas = section.querySelector('.moe-particles');
  const glow = section.querySelector('.moe-glow');
  const trailDots = Array.from(section.querySelectorAll('.moe-trail-dot'));
  const steps = Array.from(wrap.querySelectorAll(':scope > .moe-card, :scope > .moe-experts'));
  const particleField = canvas ? createParticleField(canvas, { count: 55, colorVar: '--muted' }) : null;

  let currentIndex = 0; // stage 0 (Input) starts visible
  let running = false;

  function pulseGlow() {
    if (REDUCED_MOTION || !glow) return;
    gsap.fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 });
  }

  function updateTrail(idx) {
    trailDots.forEach((d, i) => d.classList.toggle('moe-trail-dot-active', i === idx));
  }

  function enterExpertsStep(el) {
    const experts = Array.from(el.querySelectorAll('.moe-expert'));
    const chosenIdx = Number(el.dataset.chosen || 0);
    const caption = el.querySelector('.moe-experts-caption');
    gsap.set(experts, { opacity: 0, scale: 0.7 });
    if (caption) gsap.set(caption, { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(el, { opacity: 1, duration: 0.3 }, 0)
      .to(experts, { opacity: 0.35, scale: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(1.6)' }, 0.05)
      .call(() => experts[chosenIdx] && experts[chosenIdx].classList.add('moe-expert-active'))
      .to(experts[chosenIdx] || experts[0], { scale: 1.12, duration: 0.3, ease: 'back.out(2)' }, '>-0.1')
      .to(caption, { opacity: 1, duration: 0.4 }, '>-0.1');
    return tl;
  }

  function exitExpertsStep(el) {
    el.querySelectorAll('.moe-expert').forEach((ex) => ex.classList.remove('moe-expert-active'));
    return gsap.to(el, { opacity: 0, duration: 0.25 });
  }

  function enterCardStep(el) {
    gsap.set(el, { opacity: 0, scale: 0.85 });
    return gsap.to(el, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' });
  }

  function exitCardStep(el) {
    return gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power1.in' });
  }

  function showStep(el) {
    return el.classList.contains('moe-experts') ? enterExpertsStep(el) : enterCardStep(el);
  }

  function hideStep(el) {
    return el.classList.contains('moe-experts') ? exitExpertsStep(el) : exitCardStep(el);
  }

  function goToIndex(newIndex, animate) {
    if (newIndex === currentIndex && animate) return;
    const from = steps[currentIndex];
    const to = steps[newIndex];
    if (animate && !REDUCED_MOTION) {
      if (from && from !== to) hideStep(from);
      showStep(to);
      pulseGlow();
    } else {
      steps.forEach((s, i) => {
        if (i === newIndex) {
          if (s.classList.contains('moe-experts')) {
            const chosenIdx = Number(s.dataset.chosen || 0);
            gsap.set(s, { opacity: 1 });
            gsap.set(s.querySelectorAll('.moe-expert'), { opacity: 0.35, scale: 1 });
            const chosen = s.querySelectorAll('.moe-expert')[chosenIdx];
            if (chosen) { chosen.classList.add('moe-expert-active'); gsap.set(chosen, { scale: 1.12 }); }
            const caption = s.querySelector('.moe-experts-caption');
            if (caption) gsap.set(caption, { opacity: 1 });
          } else {
            gsap.set(s, { opacity: 1, scale: 1 });
          }
        } else {
          if (s.classList.contains('moe-experts')) s.querySelectorAll('.moe-expert').forEach((ex) => ex.classList.remove('moe-expert-active'));
          gsap.set(s, { opacity: 0, scale: 0.85 });
        }
      });
    }
    currentIndex = newIndex;
    updateTrail(newIndex);
  }

  function stepIndexFor(fragmentEl) {
    if (!fragmentEl || !fragmentEl.closest) return -1;
    const el = fragmentEl.closest('.moe-card, .moe-experts');
    return el ? steps.indexOf(el) : -1;
  }

  function onFragmentShown(e) {
    const idx = stepIndexFor(e.fragment);
    if (idx === -1) return;
    goToIndex(idx, true);
  }

  function onFragmentHidden(e) {
    const idx = stepIndexFor(e.fragment);
    if (idx === -1) return;
    goToIndex(Math.max(0, idx - 1), true);
  }

  window.Reveal.on('fragmentshown', onFragmentShown);
  window.Reveal.on('fragmenthidden', onFragmentHidden);

  function currentlyShownIndex() {
    // walk from the end: the last fragment step marked "visible" (or stage 0 if none yet) is current
    for (let i = steps.length - 1; i >= 1; i--) {
      if (steps[i].classList.contains('visible')) return i;
    }
    return 0;
  }

  function setRunning(v) {
    if (running === v) return;
    running = v;
    if (particleField) {
      if (v) particleField.start(); else particleField.stop();
    }
  }

  window.Reveal.on('slidechanged', (e) => {
    const isCurrent = e.currentSlide === section;
    setRunning(isCurrent);
    if (isCurrent) goToIndex(currentlyShownIndex(), false);
  });
  window.addEventListener('resize', () => { if (particleField) particleField.resize(); });

  goToIndex(currentlyShownIndex(), false);
  setRunning(!!(window.Reveal.getCurrentSlide && window.Reveal.getCurrentSlide() === section));
}

function boot() {
  if (!window.Reveal) return;
  if (window.Reveal.isReady && window.Reveal.isReady()) initPipeline();
  else window.Reveal.on('ready', initPipeline);
}

boot();

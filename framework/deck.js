/* ============================================================================
   DeckKit — Runtime / interaction layer (over reveal.js)
   Requires: Reveal (+ RevealNotes, RevealHighlight) loaded before this file.
   ========================================================================== */
(function () {
  'use strict';

  var TRACKS = ['plain', 'tech', 'phd'];
  var TRACK_LABEL = { plain: 'PLAIN', tech: 'TECH', phd: 'PhD' };
  var LS_THEME = 'deckTheme';
  var LS_DEPTH = 'deckDepth';

  /* ---- Theme -------------------------------------------------------------- */
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (window.mermaid && window.__deckRemermaid) window.__deckRemermaid(theme === 'dark');
    var cur = window.Reveal && Reveal.isReady && Reveal.isReady() ? Reveal.getCurrentSlide() : null;
    if (cur) remountVisual(cur, true);
  }
  function initTheme() {
    var saved = localStorage.getItem(LS_THEME);
    applyTheme(saved === 'dark' ? 'dark' : 'light'); // light is the default
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(LS_THEME, next);
    applyTheme(next);
  }

  /* ---- Depth layers (global + per-slide, accessible tabs) ----------------- */
  var globalDepth = localStorage.getItem(LS_DEPTH) || 'plain';
  var overrides = {}; // slideId -> track

  function slideKey(slide) {
    return slide.id || (slide.getAttribute('data-key') || String(Array.prototype.indexOf.call(slide.parentNode.children, slide)));
  }
  function panelsIn(slide) { return slide.querySelectorAll(':scope > .layers-body .depth-panel'); }

  function buildTabs(slide) {
    if (slide.__tabsBuilt) return;
    var head = slide.querySelector(':scope > .layers-head');
    var panels = panelsIn(slide);
    if (!head || !panels.length) return;
    slide.__tabsBuilt = true;
    var present = TRACKS.filter(function (t) { return slide.querySelector('.depth-panel[data-track="' + t + '"]'); });
    var tabs = document.createElement('div');
    tabs.className = 'depth-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Explanation depth');
    present.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'depth-tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('data-track', t);
      b.textContent = TRACK_LABEL[t];
      b.addEventListener('click', function (e) { e.stopPropagation(); setSlideDepth(slide, t); });
      tabs.appendChild(b);
    });
    head.appendChild(tabs);
  }

  function applyDepth(slide) {
    var panels = panelsIn(slide);
    if (!panels.length) return;
    buildTabs(slide);
    var want = overrides[slideKey(slide)] || globalDepth;
    // fall back to the first available track if the wanted one is absent
    if (!slide.querySelector('.depth-panel[data-track="' + want + '"]')) {
      var first = slide.querySelector('.depth-panel');
      want = first ? first.getAttribute('data-track') : want;
    }
    panels.forEach(function (p) {
      var on = p.getAttribute('data-track') === want;
      p.hidden = !on;
      p.setAttribute('role', 'tabpanel');
      if (on) { p.classList.remove('is-animating'); void p.offsetWidth; p.classList.add('is-animating'); }
    });
    slide.querySelectorAll('.depth-tab').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-track') === want ? 'true' : 'false');
    });
  }
  function applyDepthAll() {
    document.querySelectorAll('.reveal .slides section[data-layout="layers"]').forEach(applyDepth);
  }
  function setGlobalDepth(track) {
    globalDepth = track;
    overrides = {};              // a global switch clears per-slide overrides
    localStorage.setItem(LS_DEPTH, track);
    applyDepthAll();
  }
  function setSlideDepth(slide, track) {
    overrides[slideKey(slide)] = track;
    applyDepth(slide);
  }

  /* ---- Module helpers ----------------------------------------------------- */
  function modules() { return document.querySelectorAll('.reveal .slides > section[data-module]'); }
  function coreSlides(mod) {
    var out = [];
    mod.querySelectorAll(':scope > section').forEach(function (s) {
      if (s.hasAttribute('data-extra')) return;
      out.push(s);
    });
    return out;
  }

  /* ---- Launchpad (jump-to on title slides) -------------------------------- */
  function buildLaunchpads() {
    modules().forEach(function (mod) {
      var title = mod.querySelector(':scope > section');
      if (!title || title.querySelector('.launchpad')) return;
      var layers = mod.querySelector(':scope > section[data-layout="layers"]');
      var visual = mod.querySelector(':scope > section[data-layout="visual"]');
      if (!layers && !visual) return;
      var lp = document.createElement('div');
      lp.className = 'launchpad';
      lp.innerHTML = '<span class="launchpad-label">Jump to:</span>';
      if (layers) {
        TRACKS.forEach(function (t) {
          if (!layers.querySelector('.depth-panel[data-track="' + t + '"]')) return;
          var b = document.createElement('button');
          b.className = 'lp-btn lp-' + t;
          b.textContent = TRACK_LABEL[t];
          b.addEventListener('click', function (e) {
            e.stopPropagation();
            setGlobalDepth(t);
            var i = Reveal.getIndices(layers); Reveal.slide(i.h, i.v);
          });
          lp.appendChild(b);
        });
      }
      if (visual) {
        var vb = document.createElement('button');
        vb.className = 'lp-btn lp-visual';
        vb.textContent = '▶ VISUAL';
        vb.addEventListener('click', function (e) {
          e.stopPropagation();
          var i = Reveal.getIndices(visual); Reveal.slide(i.h, i.v);
        });
        lp.appendChild(vb);
      }
      var anchor = title.querySelector('[data-launchpad-anchor]');
      (anchor || title).appendChild(lp);
    });
  }

  /* ---- Breadcrumbs -------------------------------------------------------- */
  var bar;
  function initBreadcrumbs() {
    bar = document.createElement('div');
    bar.id = 'deck-breadcrumbs';
    document.querySelector('.reveal').appendChild(bar);
  }
  function updateBreadcrumbs(slide) {
    if (!bar) return;
    var mod = slide && slide.closest('section[data-module]');
    if (!mod) { bar.style.display = 'none'; return; }
    var core = coreSlides(mod);
    if (core.length < 2) { bar.style.display = 'none'; return; }
    var cur = core.indexOf(slide);
    bar.innerHTML = '';
    var lbl = document.createElement('span');
    lbl.className = 'bc-label';
    lbl.textContent = (mod.getAttribute('data-module') || '').toUpperCase();
    bar.appendChild(lbl);
    core.forEach(function (s, i) {
      var d = document.createElement('button');
      d.className = 'bc-dot' + (i === cur ? ' active' : '');
      d.textContent = (i + 1);
      var h = s.querySelector('h1, h2, h3, .slide-h1');
      if (h) d.title = (i + 1) + '. ' + h.textContent.trim();
      d.addEventListener('click', function (e) { e.stopPropagation(); var idx = Reveal.getIndices(s); Reveal.slide(idx.h, idx.v); });
      bar.appendChild(d);
    });
    bar.style.display = 'flex';
  }

  /* ---- Images: hydrate backgrounds + placeholders ------------------------- */
  function hydrateImages() {
    document.querySelectorAll('.slide-bg-img[data-image]').forEach(function (el) {
      var src = el.getAttribute('data-image');
      if (src) el.style.backgroundImage = 'url("' + src + '")';
      var focal = el.getAttribute('data-focal');
      if (focal) el.style.backgroundPosition = focal;
    });
    // <figure> images: mark empty ones as placeholders
    document.querySelectorAll('.deck-figure .img-box').forEach(function (box) {
      var img = box.querySelector('img');
      var hasSrc = img && img.getAttribute('src');
      if (!hasSrc && !box.hasAttribute('data-empty')) box.setAttribute('data-empty', 'Picture — set src');
    });
  }

  /* ---- Native visuals registry ------------------------------------------- */
  var VISUALS = {};
  window.DeckVisual = function (name, mountFn) { VISUALS[name] = mountFn; };

  function remountVisual(slide, themeChanged) {
    if (!slide || slide.getAttribute('data-layout') !== 'visual') return;
    var name = slide.getAttribute('data-visual');
    var stage = slide.querySelector('.visual-stage');
    if (!name || !stage || !VISUALS[name]) return;
    if (slide.__visualMounted && !themeChanged) return;
    stage.innerHTML = '';
    try { VISUALS[name](stage, { theme: currentTheme() }); slide.__visualMounted = true; }
    catch (e) { stage.textContent = 'Visual error: ' + e.message; }
  }

  /* ---- Presenter help overlay -------------------------------------------- */
  function initHelp() {
    var o = document.createElement('div');
    o.id = 'deck-help';
    o.innerHTML =
      '<div class="help-card" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">' +
      '<h2>Keyboard & presenter controls</h2>' +
      '<div class="help-grid">' +
      '<kbd>→ / ←</kbd><span>Next / previous</span>' +
      '<kbd>↓ / ↑</kbd><span>Within a module (extras &amp; diagrams)</span>' +
      '<kbd>1 / 2 / 3</kbd><span>Set depth for the whole deck (Plain / Tech / PhD)</span>' +
      '<kbd>▶ Visual</kbd><span>Jump to a module’s interactive visual</span>' +
      '<kbd>? </kbd><span>This help</span>' +
      '<kbd>S</kbd><span>Speaker view (notes + next slide)</span>' +
      '<kbd>F</kbd><span>Fullscreen</span>' +
      '<kbd>Esc / O</kbd><span>Overview / exit</span>' +
      '<kbd>T</kbd><span>Toggle light / dark</span>' +
      '</div><p style="margin-top:1rem;color:var(--text-dim);font-size:var(--text-sm)">Press ? or Esc to close.</p></div>';
    o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('open'); });
    document.body.appendChild(o);
  }
  function toggleHelp() {
    var o = document.getElementById('deck-help');
    if (o) o.classList.toggle('open');
  }

  /* ---- Keymap ------------------------------------------------------------- */
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var help = document.getElementById('deck-help');
    if (e.key === 'Escape' && help && help.classList.contains('open')) { help.classList.remove('open'); e.stopPropagation(); return; }
    switch (e.key) {
      case '1': setGlobalDepth('plain'); break;
      case '2': setGlobalDepth('tech'); break;
      case '3': setGlobalDepth('phd'); break;
      case 't': case 'T': toggleTheme(); break;
      case '?': toggleHelp(); break;
    }
  }

  /* ---- Boot --------------------------------------------------------------- */
  function boot() {
    initTheme();
    Reveal.initialize({
      hash: true, history: true, width: 1280, height: 720, margin: 0.04,
      minScale: 0.2, maxScale: 2.0, controls: true, progress: true, center: false,
      transition: 'slide', transitionSpeed: 'fast', backgroundTransition: 'fade',
      plugins: (function () {
        var p = [];
        if (window.RevealNotes) p.push(RevealNotes);
        if (window.RevealHighlight) p.push(RevealHighlight);
        return p;
      })()
    });

    initBreadcrumbs();
    initHelp();
    hydrateImages();
    if (window.lucide && lucide.createIcons) lucide.createIcons();

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', onKey);

    Reveal.on('ready', function (e) {
      buildLaunchpads();
      applyDepthAll();
      updateBreadcrumbs(Reveal.getCurrentSlide());
      remountVisual(Reveal.getCurrentSlide());
    });
    Reveal.on('slidechanged', function (e) {
      applyDepth(e.currentSlide);
      updateBreadcrumbs(e.currentSlide);
      remountVisual(e.currentSlide);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

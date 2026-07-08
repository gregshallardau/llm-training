/* ============================================================================
   DeckKit — Runtime / interaction layer (over reveal.js)
   reveal owns each <section> (transitions + positioning). The framework owns a
   `.deck-slide` canvas INSIDE it — a plain div reveal never touches — so layout,
   depth tabs, and shrink-to-fit never fight reveal's inline styles.
   Requires: Reveal (+ RevealNotes, RevealHighlight) loaded before this file.
   ========================================================================== */
(function () {
  'use strict';

  var TRACKS = ['plain', 'tech', 'phd'];
  var TRACK_LABEL = { plain: 'PLAIN', tech: 'TECH', phd: 'PhD' };
  var LS_THEME = 'deckTheme';
  var LS_DEPTH = 'deckDepth';
  var root = document.documentElement;

  function canvasOf(section) { return section ? section.querySelector(':scope > .deck-slide') : null; }

  /* ---- Theme -------------------------------------------------------------- */
  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    var cur = window.Reveal && Reveal.isReady && Reveal.isReady() ? Reveal.getCurrentSlide() : null;
    if (cur) { remountVisual(cur, true); fitSlide(cur); }
  }
  function initTheme() { applyTheme(localStorage.getItem(LS_THEME) === 'dark' ? 'dark' : 'light'); }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(LS_THEME, next);
    applyTheme(next);
  }

  /* ---- Depth layers (global + per-slide, accessible tabs) ----------------- */
  var globalDepth = localStorage.getItem(LS_DEPTH) || 'plain';
  var overrides = new Map(); // canvas element -> track

  function layerCanvases() { return document.querySelectorAll('.deck-slide[data-layout="layers"]'); }
  function panelsIn(ds) { return ds.querySelectorAll(':scope > .layers-body .depth-panel'); }

  function buildTabs(ds) {
    if (ds.__tabsBuilt) return;
    var head = ds.querySelector(':scope > .layers-head');
    if (!head || !panelsIn(ds).length) return;
    ds.__tabsBuilt = true;
    var present = TRACKS.filter(function (t) { return ds.querySelector('.depth-panel[data-track="' + t + '"]'); });
    var tabs = document.createElement('div');
    tabs.className = 'depth-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Explanation depth');
    present.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'depth-tab'; b.setAttribute('role', 'tab'); b.setAttribute('data-track', t);
      b.textContent = TRACK_LABEL[t];
      b.addEventListener('click', function (e) { e.stopPropagation(); setSlideDepth(ds, t); });
      tabs.appendChild(b);
    });
    head.appendChild(tabs);
  }

  function applyDepth(ds) {
    var panels = panelsIn(ds);
    if (!panels.length) return;
    buildTabs(ds);
    var want = overrides.get(ds) || globalDepth;
    if (!ds.querySelector('.depth-panel[data-track="' + want + '"]')) {
      var first = ds.querySelector('.depth-panel');
      want = first ? first.getAttribute('data-track') : want;
    }
    panels.forEach(function (p) {
      var on = p.getAttribute('data-track') === want;
      p.hidden = !on; p.setAttribute('role', 'tabpanel');
      if (on) { p.classList.remove('is-animating'); void p.offsetWidth; p.classList.add('is-animating'); }
    });
    ds.querySelectorAll('.depth-tab').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-track') === want ? 'true' : 'false');
    });
  }
  function applyDepthAll() { layerCanvases().forEach(applyDepth); }
  function setGlobalDepth(track) {
    globalDepth = track; overrides.clear();
    localStorage.setItem(LS_DEPTH, track);
    applyDepthAll();
    var cur = Reveal.getCurrentSlide(); if (cur) fitSlide(cur);
  }
  function setSlideDepth(ds, track) {
    overrides.set(ds, track); applyDepth(ds);
    var cur = Reveal.getCurrentSlide(); if (cur) fitSlide(cur);
  }

  /* ---- Shrink-to-fit: no canvas ever exceeds the frame -------------------- */
  function fitSlide(section) {
    var ds = canvasOf(section);
    if (!ds) return;
    var layout = ds.getAttribute('data-layout');
    if (layout === 'visual' || layout === 'image') return; // full-bleed: components self-fit
    ds.style.transform = '';
    // measure in the canvas's own (design) coordinate space
    var over = ds.scrollHeight - ds.clientHeight;
    if (over > 1 && ds.scrollHeight > 0) {
      var scale = Math.max(0.4, ds.clientHeight / ds.scrollHeight);
      ds.style.transformOrigin = 'center center';
      ds.style.transform = 'scale(' + scale + ')';
    }
  }

  /* ---- Modules & nav ------------------------------------------------------ */
  function modules() { return document.querySelectorAll('.reveal .slides > section[data-module]'); }
  function coreSlides(mod) {
    var out = [];
    mod.querySelectorAll(':scope > section').forEach(function (s) { if (!s.hasAttribute('data-extra')) out.push(s); });
    return out;
  }
  function sectionOfCanvas(ds) { return ds ? ds.closest('section') : null; }

  function buildLaunchpads() {
    modules().forEach(function (mod) {
      var titleDs = mod.querySelector(':scope > section:first-child > .deck-slide');
      if (!titleDs || titleDs.querySelector('.launchpad')) return;
      var layersDs = mod.querySelector(':scope > section > .deck-slide[data-layout="layers"]');
      var visualDs = mod.querySelector(':scope > section > .deck-slide[data-layout="visual"]');
      if (!layersDs && !visualDs) return;

      var lp = document.createElement('div');
      lp.className = 'launchpad';
      lp.innerHTML = '<span class="launchpad-label">Jump to:</span>';
      if (layersDs) {
        var layersSection = sectionOfCanvas(layersDs);
        TRACKS.forEach(function (t) {
          if (!layersDs.querySelector('.depth-panel[data-track="' + t + '"]')) return;
          var b = document.createElement('button');
          b.className = 'lp-btn lp-' + t; b.textContent = TRACK_LABEL[t];
          b.addEventListener('click', function (e) {
            e.stopPropagation(); setGlobalDepth(t);
            var i = Reveal.getIndices(layersSection); Reveal.slide(i.h, i.v);
          });
          lp.appendChild(b);
        });
      }
      if (visualDs) {
        var visualSection = sectionOfCanvas(visualDs);
        var vb = document.createElement('button');
        vb.className = 'lp-btn lp-visual'; vb.textContent = '▶ VISUAL';
        vb.addEventListener('click', function (e) { e.stopPropagation(); var i = Reveal.getIndices(visualSection); Reveal.slide(i.h, i.v); });
        lp.appendChild(vb);
      }
      var anchor = titleDs.querySelector('[data-launchpad-anchor]');
      (anchor || titleDs).appendChild(lp);
    });
  }

  /* ---- Breadcrumbs -------------------------------------------------------- */
  var bar;
  function initBreadcrumbs() { bar = document.createElement('div'); bar.id = 'deck-breadcrumbs'; document.querySelector('.reveal').appendChild(bar); }
  function updateBreadcrumbs(slide) {
    if (!bar) return;
    var mod = slide && slide.closest('section[data-module]');
    if (!mod) { bar.style.display = 'none'; return; }
    var core = coreSlides(mod);
    if (core.length < 2) { bar.style.display = 'none'; return; }
    var cur = core.indexOf(slide);
    bar.innerHTML = '';
    var lbl = document.createElement('span');
    lbl.className = 'bc-label'; lbl.textContent = (mod.getAttribute('data-module') || '').toUpperCase();
    bar.appendChild(lbl);
    core.forEach(function (s, i) {
      var d = document.createElement('button');
      d.className = 'bc-dot' + (i === cur ? ' active' : ''); d.textContent = (i + 1);
      var h = s.querySelector('.deck-slide h1, .deck-slide h2, .deck-slide h3');
      if (h) d.title = (i + 1) + '. ' + h.textContent.trim();
      d.addEventListener('click', function (e) { e.stopPropagation(); var idx = Reveal.getIndices(s); Reveal.slide(idx.h, idx.v); });
      bar.appendChild(d);
    });
    bar.style.display = 'flex';
  }

  /* ---- Images: hydrate backgrounds + placeholders ------------------------- */
  function hydrateImages() {
    document.querySelectorAll('.slide-bg-img[data-image]').forEach(function (el) {
      var src = el.getAttribute('data-image'); if (src) el.style.backgroundImage = 'url("' + src + '")';
      var focal = el.getAttribute('data-focal'); if (focal) el.style.backgroundPosition = focal;
    });
    document.querySelectorAll('.deck-figure .img-box').forEach(function (box) {
      var img = box.querySelector('img');
      if (!(img && img.getAttribute('src')) && !box.hasAttribute('data-empty')) box.setAttribute('data-empty', 'Picture — set src');
    });
  }

  /* ---- Native visuals registry ------------------------------------------- */
  var VISUALS = {};
  window.DeckVisual = function (name, mountFn) { VISUALS[name] = mountFn; };
  function remountVisual(section, themeChanged) {
    var ds = section && section.querySelector(':scope > .deck-slide[data-visual]');
    if (!ds) return;
    var name = ds.getAttribute('data-visual');
    var stage = ds.querySelector('.visual-stage');
    if (!name || !stage || !VISUALS[name]) return;
    if (ds.__visualMounted && !themeChanged) return;
    stage.innerHTML = '';
    try { VISUALS[name](stage, { theme: currentTheme() }); ds.__visualMounted = true; }
    catch (e) { stage.textContent = 'Visual error: ' + e.message; }
  }

  /* ---- Presenter help overlay -------------------------------------------- */
  function initHelp() {
    var o = document.createElement('div'); o.id = 'deck-help';
    o.innerHTML = '<div class="help-card" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">' +
      '<h2>Keyboard &amp; presenter controls</h2><div class="help-grid">' +
      '<kbd>→ / ←</kbd><span>Next / previous</span>' +
      '<kbd>↓ / ↑</kbd><span>Within a module</span>' +
      '<kbd>1 / 2 / 3</kbd><span>Depth for the whole deck (Plain / Tech / PhD)</span>' +
      '<kbd>▶ Visual</kbd><span>Jump to a module’s interactive visual</span>' +
      '<kbd>?</kbd><span>This help</span><kbd>S</kbd><span>Speaker view</span>' +
      '<kbd>F</kbd><span>Fullscreen</span><kbd>Esc / O</kbd><span>Overview</span>' +
      '<kbd>T</kbd><span>Toggle light / dark</span>' +
      '</div><p style="margin-top:1rem;color:var(--text-dim);font-size:var(--text-sm)">Press ? or Esc to close.</p></div>';
    o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('open'); });
    document.body.appendChild(o);
  }
  function toggleHelp() { var o = document.getElementById('deck-help'); if (o) o.classList.toggle('open'); }

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
  function onSlide(section) {
    applyDepthAll();
    remountVisual(section);
    updateBreadcrumbs(section);
    // fit after content (visuals/depth) settles
    requestAnimationFrame(function () { fitSlide(section); });
    setTimeout(function () { fitSlide(section); }, 60);
  }

  function boot() {
    initTheme();
    Reveal.initialize({
      hash: true, history: true, width: 1280, height: 720, margin: 0.04,
      minScale: 0.2, maxScale: 2.0, controls: true, progress: true, center: false,
      transition: 'slide', transitionSpeed: 'fast', backgroundTransition: 'fade',
      plugins: (function () { var p = []; if (window.RevealNotes) p.push(RevealNotes); if (window.RevealHighlight) p.push(RevealHighlight); return p; })()
    });

    initBreadcrumbs();
    initHelp();
    hydrateImages();
    if (window.lucide && lucide.createIcons) lucide.createIcons();

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', onKey);

    Reveal.on('ready', function (e) { buildLaunchpads(); onSlide(Reveal.getCurrentSlide()); });
    Reveal.on('slidechanged', function (e) { onSlide(e.currentSlide); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

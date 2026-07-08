/* Presenter-first operation (P9/P10) + layered content (P8) + theming toggle.
   Slick chrome: reveal's own arrow controls are off; we add a theme toggle, a
   help overlay, and keep reveal's speaker window (S) and thin progress bar. */
import { el } from './util.js';

const LS_THEME = 'deckTheme', LS_DEPTH = 'deckDepth';
const root = document.documentElement;

export function applyThemeInitial() {
  root.setAttribute('data-theme', localStorage.getItem(LS_THEME) === 'dark' ? 'dark' : 'light');
}
function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

let depthLevels = [], globalDepth = null;

export function initPresenter(deck, { remountVisualsIn }) {
  // theme toggle
  const btn = el('button#deck-theme', { 'aria-label': 'Toggle theme', title: 'Theme (T)' });
  const paintBtn = () => { btn.textContent = currentTheme() === 'dark' ? '☀' : '☾'; };
  paintBtn();
  const toggleTheme = () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(LS_THEME, next); root.setAttribute('data-theme', next); paintBtn();
    remountVisualsIn(deck.getCurrentSlide());
    window.dispatchEvent(new Event('deck-refit'));
  };
  btn.addEventListener('click', toggleTheme);
  document.body.append(btn);

  // help overlay
  const help = buildHelp();
  document.body.append(help);
  const toggleHelp = () => help.classList.toggle('open');

  // layered content (P8)
  depthLevels = orderedDepthLevels();
  globalDepth = localStorage.getItem(LS_DEPTH) || depthLevels[0] || null;

  deck.on('ready', () => { buildDepthTabs(deck); applyDepth(deck); });
  deck.on('slidechanged', () => applyDepth(deck));

  // keymap
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape' && help.classList.contains('open')) { help.classList.remove('open'); e.stopPropagation(); return; }
    if (e.key === '?') return toggleHelp();
    if (e.key === 't' || e.key === 'T') return toggleTheme();
    const idx = ['1', '2', '3', '4', '5'].indexOf(e.key);
    if (idx > -1 && depthLevels[idx]) setDepth(deck, depthLevels[idx]);
  });
}

function orderedDepthLevels() {
  const seen = [];
  document.querySelectorAll('.dk-depth').forEach((d) => {
    const lv = d.getAttribute('data-depth');
    if (lv && !seen.includes(lv)) seen.push(lv);
  });
  return seen;
}

function buildDepthTabs(deck) {
  document.querySelectorAll('.dk-layers').forEach((layers) => {
    if (layers.__tabs) return;
    const levels = [...layers.querySelectorAll(':scope > .dk-depth')].map((d) => d.getAttribute('data-depth'));
    const tabs = el('div.dk-tabs', { role: 'tablist', 'aria-label': 'Explanation depth' },
      levels.map((lv) =>
        el('button.dk-tab', { role: 'tab', 'data-depth': lv, onclick: (ev) => { ev.stopPropagation(); setDepth(deck, lv); } }, lv)));
    layers.prepend(tabs);
    layers.__tabs = true;
  });
}

function setDepth(deck, level) {
  globalDepth = level;
  localStorage.setItem(LS_DEPTH, level);
  applyDepth(deck);
}

function applyDepth(deck) {
  document.querySelectorAll('.dk-layers').forEach((layers) => {
    const panels = [...layers.querySelectorAll(':scope > .dk-depth')];
    let want = globalDepth;
    if (!panels.some((p) => p.getAttribute('data-depth') === want)) want = panels[0]?.getAttribute('data-depth');
    panels.forEach((p) => {
      const on = p.getAttribute('data-depth') === want;
      p.hidden = !on; p.setAttribute('role', 'tabpanel');
    });
    layers.querySelectorAll('.dk-tab').forEach((t) =>
      t.setAttribute('aria-selected', t.getAttribute('data-depth') === want ? 'true' : 'false'));
  });
  window.dispatchEvent(new Event('deck-refit'));
}

function buildHelp() {
  const rows = [
    ['→ / ←', 'Next / previous'], ['↓ / ↑', 'Within a stack'],
    ['1 / 2 / 3', 'Depth for the whole deck'], ['?', 'This help'],
    ['S', 'Speaker window (notes + next + timer)'], ['F', 'Fullscreen'],
    ['Esc / O', 'Overview'], ['T', 'Light / dark']
  ];
  return el('div#deck-help', { onclick: (e) => { if (e.target.id === 'deck-help') e.currentTarget.classList.remove('open'); } },
    el('div.dk-help-card', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Keyboard shortcuts' },
      el('h2', null, 'Keyboard & presenter'),
      el('div.dk-help-grid', null, rows.flatMap(([k, v]) => [el('kbd', null, k), el('span', null, v)])),
      el('p.dk-muted', { style: { marginTop: '1rem' } }, 'Press ? or Esc to close.')
    ));
}

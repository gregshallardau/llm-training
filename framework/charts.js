/* ============================================================================
   DeckKit — Chart.js adapter
   Wraps Chart.js as themed DeckVisual components: colours are read from the deck
   design tokens at mount time, so charts match light/dark and re-render on the
   theme toggle (deck.js remounts visuals when the theme changes).
   ========================================================================== */
(function () {
  'use strict';
  if (!window.DeckVisual || !window.Chart) return;

  function tok(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  // Fixed categorical order (never cycled) — matches the dataviz method.
  function palette() {
    return [tok('--brand'), tok('--brand-2'), tok('--accent-green'), tok('--accent-warm'), tok('--accent-red')];
  }
  function baseOptions() {
    var ink = tok('--text-muted'), grid = tok('--border');
    Chart.defaults.font.family = tok('--font-sans') || 'Inter, sans-serif';
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: ink } }, tooltip: { enabled: true } },
      scales: {
        x: { ticks: { color: ink }, grid: { color: grid, drawBorder: false } },
        y: { ticks: { color: ink }, grid: { color: grid, drawBorder: false }, beginAtZero: true }
      }
    };
  }

  function mountBar(stage, cfg) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;height:100%;max-width:1040px;margin:auto;display:flex;flex-direction:column;gap:var(--space-3)';
    if (cfg.title) wrap.innerHTML = '<div><h2 style="margin:0">' + cfg.title + '</h2>' +
      (cfg.sub ? '<p style="margin:.2em 0 0;color:var(--text-muted);font-size:var(--text-sm)">' + cfg.sub + '</p>' : '') + '</div>';
    var box = document.createElement('div');
    box.style.cssText = 'position:relative;flex:1;min-height:0';
    var canvas = document.createElement('canvas');
    box.appendChild(canvas); wrap.appendChild(box); stage.appendChild(wrap);

    var colors = palette();
    new Chart(canvas.getContext('2d'), {
      type: cfg.type || 'bar',
      data: {
        labels: cfg.labels,
        datasets: cfg.datasets.map(function (d, i) {
          return Object.assign({
            backgroundColor: (cfg.type === 'line') ? 'transparent' : colors[i % colors.length],
            borderColor: colors[i % colors.length],
            borderWidth: cfg.type === 'line' ? 2 : 0,
            borderRadius: 4,
            tension: 0.3,
            pointRadius: 3
          }, d);
        })
      },
      options: baseOptions()
    });
  }

  /* Demo chart used in the component-library showcase. Illustrative figures. */
  window.DeckVisual('chart-context', function (stage) {
    mountBar(stage, {
      title: 'Context windows have exploded',
      sub: 'Approximate max context (tokens) by model generation — illustrative.',
      type: 'bar',
      labels: ['2020', '2022', '2023', '2024', '2025'],
      datasets: [{ label: 'Max context (tokens)', data: [2048, 8192, 100000, 200000, 1000000] }]
    });
  });
})();

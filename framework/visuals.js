/* ============================================================================
   DeckKit — Native interactive visuals (registered via window.DeckVisual)
   All colour comes from CSS tokens (color-mix over --brand/--surface), so every
   visual is theme-aware for free. No iframes, no scaling — native slide content.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.DeckVisual) return;

  /* --- Module 03: Attention heatmap ---------------------------------------
     Sequential single-hue (magnitude) heatmap, per the dataviz method: one hue
     light→dark, per-cell hover tooltip, a gradient legend, high cells get white
     ink for contrast. Rows = a query word; cells = how much it attends to each
     other word. */
  var WORDS = ["The", "client's", "property", "insurance", "policy", "expires", "June", "30"];
  // attention weights (row = query, col = key), 0..1
  var ATTN = [
    [0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    [0.2, 0.9, 0.5, 0.5, 0.8, 0.1, 0.1, 0.1],
    [0.1, 0.5, 0.9, 0.8, 0.8, 0.1, 0.1, 0.1],
    [0.1, 0.4, 0.8, 0.9, 0.8, 0.1, 0.1, 0.1],
    [0.1, 0.6, 0.8, 0.8, 0.9, 0.2, 0.1, 0.1],
    [0.1, 0.1, 0.2, 0.2, 0.3, 0.9, 0.7, 0.7],
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.7, 0.9, 0.8],
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.7, 0.8, 0.9]
  ];

  window.DeckVisual('attention-heatmap', function (stage) {
    var root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:var(--space-4);max-width:1040px;margin:auto;';

    root.innerHTML =
      '<div>' +
        '<h2 style="margin:0">The attention mechanism</h2>' +
        '<p style="margin:.2em 0 0;color:var(--text-muted);font-size:var(--text-sm)">' +
        'Processing “The client’s property insurance policy expires June 30” — each row shows how much a word <em>attends to</em> the others. Hover any cell.</p>' +
      '</div>';

    var grid = document.createElement('div');
    var n = WORDS.length;
    // cap width so all n rows are square AND fit the slide height (~8 rows fit ~520px)
    grid.style.cssText = 'display:grid;grid-template-columns:auto repeat(' + n + ',1fr);gap:3px;font-family:var(--font-mono);font-size:var(--text-xs);width:100%;max-width:560px;';

    // header row
    grid.appendChild(cell('', 'label header corner'));
    WORDS.forEach(function (w) { grid.appendChild(cell(w, 'header col')); });

    // body
    for (var r = 0; r < n; r++) {
      grid.appendChild(cell(WORDS[r], 'label row', r));
      for (var c = 0; c < n; c++) {
        var v = ATTN[r][c];
        var el = cell('', 'attn', r, c);
        el.style.background = 'color-mix(in srgb, var(--brand) ' + Math.round(v * 100) + '%, var(--surface))';
        el.style.color = v > 0.55 ? '#fff' : 'var(--text-dim)';
        el.style.aspectRatio = '1';
        el.style.borderRadius = '4px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.textContent = v >= 0.55 ? '▓' : (v >= 0.3 ? '▒' : '░');
        el.dataset.r = r; el.dataset.c = c; el.dataset.v = v;
        grid.appendChild(el);
      }
    }
    root.appendChild(grid);

    // legend + tooltip
    var legend = document.createElement('div');
    legend.style.cssText = 'display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-sm);color:var(--text-muted)';
    legend.innerHTML =
      '<span>low</span>' +
      '<span style="flex:0 0 180px;height:10px;border-radius:5px;background:linear-gradient(to right, var(--surface), var(--brand))"></span>' +
      '<span>high attention</span>' +
      '<span id="attn-read" style="margin-left:auto;font-weight:var(--weight-bold);color:var(--text)"></span>';
    root.appendChild(legend);

    var read = legend.querySelector('#attn-read');
    grid.addEventListener('mousemove', function (e) {
      var t = e.target.closest('.attn'); if (!t) return;
      var r = +t.dataset.r, c = +t.dataset.c;
      grid.querySelectorAll('.attn').forEach(function (x) { x.style.outline = (+x.dataset.r === r) ? '2px solid var(--brand)' : 'none'; });
      read.textContent = WORDS[r] + ' → ' + WORDS[c] + ':  ' + (+t.dataset.v).toFixed(1);
    });
    grid.addEventListener('mouseleave', function () {
      grid.querySelectorAll('.attn').forEach(function (x) { x.style.outline = 'none'; });
      read.textContent = '';
    });

    stage.appendChild(root);

    function cell(text, cls, r, c) {
      var d = document.createElement('div');
      d.className = cls;
      d.textContent = text;
      if (cls.indexOf('label') > -1 || cls.indexOf('header') > -1) {
        d.style.cssText = 'display:flex;align-items:center;padding:2px 4px;color:var(--text-muted);font-size:var(--text-xs);';
        if (cls.indexOf('header') > -1 && cls.indexOf('col') > -1) d.style.justifyContent = 'center';
      }
      return d;
    }
  });

  /* --- Module 00: Amnesia chat (stateless problem) ------------------------- */
  window.DeckVisual('amnesia-chat', function (stage) {
    var steps = [
      { who: 'you', text: 'Our biggest client is Henderson Holdings — three commercial property policies.' },
      { who: 'ai', text: 'Understood — Henderson Holdings, three commercial property policies. How can I help?' },
      { who: 'you', text: 'Draft a short renewal reminder for their warehouse policy.' },
      { who: 'ai', text: '“Dear Client, your warehouse policy is approaching renewal. Please contact your broker.”' },
      { who: 'you', text: 'Quick question — who is our biggest client?' },
      { who: 'ai', bad: true, text: 'I don’t have information about your clients. Each conversation starts fresh — I have no memory of what was shared earlier.' }
    ];
    var fixed = { who: 'ai', good: true, text: 'Your biggest client is Henderson Holdings, who hold three commercial property policies. What would you like to do for them?' };
    var i = 0;

    var root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:var(--space-4);max-width:820px;margin:auto;width:100%;';
    root.innerHTML = '<h2 style="margin:0">🧠 The stateless problem</h2>';

    var chat = document.createElement('div');
    chat.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-4);min-height:9em;max-height:44vh;overflow:auto;font-size:var(--text-sm);line-height:1.5;box-shadow:var(--shadow-1)';
    root.appendChild(chat);

    var controls = document.createElement('div');
    controls.style.cssText = 'display:flex;gap:var(--space-2);flex-wrap:wrap';
    controls.innerHTML =
      '<button class="lp-btn lp-visual" data-act="next">▶ Next message</button>' +
      '<button class="lp-btn" data-act="fix">📋 Paste base layer first</button>' +
      '<button class="lp-btn" data-act="reset">↺ Reset</button>';
    root.appendChild(controls);

    var note = document.createElement('p');
    note.style.cssText = 'color:var(--text-dim);font-size:var(--text-sm);margin:0';
    note.textContent = 'LLMs have no memory between sessions — the base layer is the fix.';
    root.appendChild(note);

    function bubble(s) {
      var b = document.createElement('div');
      b.style.cssText = 'margin:.35em 0;padding:.4em .7em;border-radius:var(--radius);max-width:85%;' +
        (s.who === 'you'
          ? 'background:var(--surface-2);margin-left:auto;text-align:right'
          : 'background:color-mix(in srgb, var(--brand) 10%, var(--surface))');
      if (s.bad) b.style.color = 'var(--accent-red)';
      if (s.good) { b.style.color = 'var(--accent-green)'; b.style.background = 'color-mix(in srgb, var(--accent-green) 12%, var(--surface))'; }
      b.innerHTML = '<strong>' + (s.who === 'you' ? 'You' : 'AI') + ':</strong> ' + s.text;
      return b;
    }
    function render() { chat.innerHTML = ''; for (var k = 0; k < i; k++) chat.appendChild(bubble(steps[k])); chat.scrollTop = chat.scrollHeight; }

    controls.addEventListener('click', function (e) {
      var act = e.target.getAttribute('data-act'); if (!act) return;
      e.stopPropagation();
      if (act === 'next') { if (i < steps.length) i++; render(); }
      else if (act === 'reset') { i = 0; render(); }
      else if (act === 'fix') { render(); chat.appendChild(bubble(fixed)); chat.scrollTop = chat.scrollHeight; }
    });
    render();
    stage.appendChild(root);
  });
})();

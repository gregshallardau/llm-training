(() => {
  // framework/util.js
  function el(spec, attrs, ...children) {
    let tag = "div", id = null;
    const classes = [];
    for (const part of spec.split(/(?=[.#])/)) {
      if (part[0] === "#") id = part.slice(1);
      else if (part[0] === ".") classes.push(part.slice(1));
      else if (part) tag = part;
    }
    const node = document.createElement(tag);
    if (id) node.id = id;
    if (classes.length) node.className = classes.join(" ");
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "html") node.innerHTML = v;
      else if (k === "style" && typeof v === "object") {
        for (const [sk, sv] of Object.entries(v)) {
          if (sk.startsWith("--")) node.style.setProperty(sk, sv);
          else node.style[sk] = sv;
        }
      } else if (k in node && k !== "list") {
        try {
          node[k] = v;
        } catch {
          node.setAttribute(k, v);
        }
      } else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  // framework/registry.js
  var layouts = /* @__PURE__ */ new Map();
  var blocks = /* @__PURE__ */ new Map();
  var visuals = /* @__PURE__ */ new Map();
  var registerLayout = (name, fn) => layouts.set(name, fn);
  var registerBlock = (name, fn) => blocks.set(name, fn);
  var registerVisual = (name, fn) => visuals.set(name, fn);
  var getLayout = (name) => layouts.get(name);
  var getBlock = (name) => blocks.get(name);
  var getVisual = (name) => visuals.get(name);

  // framework/blocks.js
  registerBlock(
    "cards",
    (p) => el("div.dk-cards", null, (p.items || []).map(
      (it) => el(
        "div.dk-card",
        null,
        it.title && el("h3", null, it.title),
        it.body && el("p", null, it.body)
      )
    ))
  );
  registerBlock("flow", (p) => {
    const steps = p.steps || [];
    const nodes = [];
    steps.forEach((s, i) => {
      nodes.push(el("div.dk-step", null, s.title && el("h4", null, s.title), s.body && el("p", null, s.body)));
      if (i < steps.length - 1) nodes.push(el("div.dk-arrow", null, "\u2192"));
    });
    return el("div.dk-flow", null, nodes);
  });
  registerBlock(
    "callout",
    (p) => el(
      "div.dk-callout",
      { "data-tone": p.tone || "brand" },
      p.title && el("h3", null, p.title),
      p.body && el("p", null, p.body)
    )
  );
  registerBlock(
    "stats",
    (p) => el("div.dk-stats", null, (p.items || []).map((it) => el(
      "div.dk-stat",
      null,
      el("div.dk-stat-val", null, it.value),
      it.label && el("div.dk-stat-label", null, it.label)
    )))
  );
  registerBlock(
    "list",
    (p) => el("ul.dk-list", null, (p.items || []).map((i) => el("li", null, i)))
  );
  registerBlock(
    "code",
    (p) => el("pre.dk-code", null, el("code", { class: `language-${p.lang || "text"}` }, p.code || ""))
  );
  registerBlock(
    "timeline",
    (p) => el("ol.dk-timeline", null, (p.items || []).map((it) => el(
      "li.dk-tl-item",
      null,
      el("div.dk-tl-dot"),
      el("div.dk-tl-body", null, it.title && el("h4", null, it.title), it.body && el("p", null, it.body))
    )))
  );
  registerBlock(
    "table",
    (p) => el(
      "table.dk-table",
      null,
      p.columns && el("thead", null, el("tr", null, p.columns.map((c) => el("th", null, c)))),
      el("tbody", null, (p.rows || []).map((r) => el("tr", null, r.map((cell) => el("td", null, cell)))))
    )
  );

  // framework/layouts.js
  function visualHost(spec) {
    const host = el("div.dk-visual-host");
    host.__visual = spec;
    return host;
  }
  var buildBlocks = (blocks2 = []) => blocks2.map((b) => {
    const fn = getBlock(b.type);
    return fn ? fn(b) : el("div", null, `[unknown block: ${b.type}]`);
  });
  registerLayout("title", (d) => ({
    mode: "flow",
    node: el(
      "div.dk-title",
      null,
      d.eyebrow && el("div.dk-eyebrow", null, d.eyebrow),
      el("h1", null, d.heading),
      d.subhead && el("p.dk-lead", null, d.subhead)
    )
  }));
  registerLayout("content", (d) => {
    const body = d.depths ? el(
      "div.dk-layers",
      { role: "group", "aria-label": "Depth" },
      Object.entries(d.depths).map(([level, spec]) => el("div.dk-depth", { "data-depth": level }, buildBlocks(spec.blocks)))
    ) : buildBlocks(d.blocks);
    return { mode: "flow", node: el("div.dk-content", null, d.heading && el("h2", null, d.heading), body) };
  });
  registerLayout("split", (d) => ({
    mode: "flow",
    node: el(
      "div.dk-split",
      { "data-media": d.mediaSide || "right" },
      el(
        "div.dk-split-text",
        null,
        d.text?.heading && el("h2", null, d.text.heading),
        d.text?.body && el("p", null, d.text.body)
      ),
      el("div.dk-split-media", null, visualHost(d.media || {}))
    )
  }));
  registerLayout("image", (d) => ({
    mode: "bleed",
    node: el(
      "div.dk-fill",
      null,
      visualHost({ component: "image", src: d.src, fit: d.fit, focal: d.focal, scrim: d.scrim, alt: d.alt }),
      el(
        "div.dk-figtext",
        null,
        d.eyebrow && el("div.dk-eyebrow.on-media", null, d.eyebrow),
        d.heading && el("h2", null, d.heading),
        d.body && el("p", null, d.body)
      )
    )
  }));
  registerLayout("visual", (d) => ({
    mode: "bleed",
    node: el("div.dk-fill", null, visualHost({ component: d.component, ...d.props || {} }))
  }));
  registerLayout("quote", (d) => ({
    mode: "flow",
    node: el(
      "div.dk-quote",
      null,
      el("p.dk-bigquote", { html: d.text }),
      d.cite && el("p.dk-cite", null, d.cite)
    )
  }));
  registerLayout("section", (d) => ({
    mode: "flow",
    node: el(
      "div.dk-section",
      null,
      d.kicker && el("div.dk-eyebrow", null, d.kicker),
      el("h1", null, d.heading),
      d.subhead && el("p.dk-lead", null, d.subhead)
    )
  }));
  registerLayout("statement", (d) => ({
    mode: "flow",
    node: el("div.dk-statement", null, el("p.dk-bigstate", { html: d.text }))
  }));
  registerLayout("grid", (d) => ({
    mode: "flow",
    node: el(
      "div.dk-content",
      null,
      d.heading && el("h2", null, d.heading),
      el("div.dk-grid", { style: { "--cols": String(d.columns || 2) } }, buildBlocks(d.blocks))
    )
  }));
  registerLayout("compare", (d) => {
    const col = (c, tone) => el(
      "div.dk-compare-col",
      { "data-tone": tone },
      c?.title && el("h4", null, c.title),
      el("ul", null, (c?.items || []).map((i) => el("li", null, i)))
    );
    return {
      mode: "flow",
      node: el(
        "div.dk-content",
        null,
        d.heading && el("h2", null, d.heading),
        el("div.dk-compare", null, col(d.left, "neg"), col(d.right, "pos"))
      )
    };
  });

  // framework/visuals.js
  var SVGNS = "http://www.w3.org/2000/svg";
  var svgEl = (tag, attrs) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
    return n;
  };
  var tok = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  var palette = () => [tok("--brand"), tok("--brand-2"), tok("--accent-green"), tok("--accent-warm")];
  registerVisual("chart", (host, props) => {
    const { type = "bar", labels = [], data = [], title, sub } = props;
    const ink = tok("--text-muted"), grid = tok("--border"), accent = palette()[0];
    const wrap = el(
      "div.dk-chart",
      null,
      (title || sub) && el(
        "div.dk-chart-head",
        null,
        title && el("h2", null, title),
        sub && el("p.dk-muted", null, sub)
      )
    );
    const box = el("div.dk-chart-box");
    wrap.append(box);
    const W = 1e3, H = 500, PL = 56, PB = 42, PT = 12, PR = 12;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: "100%", role: "img", "aria-label": title || "chart" });
    const max = Math.max(1, ...data);
    const plotW = W - PL - PR, plotH = H - PT - PB;
    const y = (v) => PT + plotH * (1 - v / max);
    for (let t = 0; t <= 4; t++) {
      const v = max / 4 * t, yy = y(v);
      svg.append(svgEl("line", { x1: PL, y1: yy, x2: W - PR, y2: yy, stroke: grid, "stroke-width": 1 }));
      const lab = svgEl("text", { x: PL - 10, y: yy + 4, "text-anchor": "end", fill: ink, "font-size": 16 });
      lab.textContent = Math.round(v).toLocaleString();
      svg.append(lab);
    }
    const readout = el("span.dk-chart-read");
    if (type === "line") {
      const step = plotW / Math.max(1, data.length - 1);
      const pts = data.map((v, i) => `${PL + i * step},${y(v)}`).join(" ");
      svg.append(svgEl("polyline", { points: pts, fill: "none", stroke: accent, "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }));
      data.forEach((v, i) => {
        const c = svgEl("circle", { cx: PL + i * step, cy: y(v), r: 5, fill: accent });
        c.addEventListener("mouseenter", () => {
          readout.textContent = `${labels[i] ?? i}: ${v.toLocaleString()}`;
        });
        svg.append(c);
      });
    } else {
      const n2 = data.length, gap = plotW / n2 * 0.28, bw = plotW / n2 - gap;
      data.forEach((v, i) => {
        const bx = PL + i * (bw + gap) + gap / 2, bh = plotH * (v / max);
        const r = svgEl("rect", { x: bx, y: PT + plotH - bh, width: bw, height: bh, rx: 4, fill: accent });
        r.addEventListener("mouseenter", () => {
          readout.textContent = `${labels[i] ?? i}: ${v.toLocaleString()}`;
        });
        svg.append(r);
      });
    }
    const n = data.length, slot = plotW / n;
    labels.forEach((l, i) => {
      const t = svgEl("text", { x: type === "line" ? PL + i * (plotW / Math.max(1, n - 1)) : PL + i * slot + slot / 2, y: H - PB + 24, "text-anchor": "middle", fill: ink, "font-size": 16 });
      t.textContent = l;
      svg.append(t);
    });
    box.append(svg);
    wrap.append(el(
      "div.dk-chart-legend",
      null,
      el("span.dk-swatch", { style: { background: accent } }),
      el("span", null, props.seriesLabel || "Series"),
      readout
    ));
    host.append(wrap);
    return () => host.replaceChildren();
  });
  registerVisual("donut", (host, props) => {
    const { title, sub, segments = [] } = props;
    const colors = palette();
    const total = segments.reduce((a, s) => a + (s.value || 0), 0) || 1;
    const size = 280, cx = size / 2, cy = size / 2, r = 100, thick = 40, C = 2 * Math.PI * r;
    const wrap = el(
      "div.dk-donut",
      null,
      (title || sub) && el("div.dk-chart-head", null, title && el("h2", null, title), sub && el("p.dk-muted", null, sub))
    );
    const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, width: "100%", height: "100%", role: "img", "aria-label": title || "donut chart" });
    let acc = 0;
    segments.forEach((s, i) => {
      const len = (s.value || 0) / total * C;
      svg.append(svgEl("circle", {
        cx,
        cy,
        r,
        fill: "none",
        stroke: colors[i % colors.length],
        "stroke-width": thick,
        "stroke-dasharray": `${len} ${C - len}`,
        "stroke-dashoffset": -acc,
        transform: `rotate(-90 ${cx} ${cy})`
      }));
      acc += len;
    });
    const centre = svgEl("text", { x: cx, y: cy, "text-anchor": "middle", "dominant-baseline": "central", fill: tok("--text"), "font-size": 36, "font-weight": 700 });
    centre.textContent = String(total);
    svg.append(centre);
    const legend = el("div.dk-donut-legend", null, segments.map((s, i) => el(
      "div.dk-legend-item",
      null,
      el("span.dk-swatch", { style: { background: colors[i % colors.length] } }),
      el("span", null, s.label),
      el("span.dk-legend-val", null, String(s.value))
    )));
    wrap.append(el("div.dk-donut-row", null, el("div.dk-donut-svg", null, svg), legend));
    host.append(wrap);
    return () => host.replaceChildren();
  });
  registerVisual("image", (host, props) => {
    const { src, fit = "cover", focal = "center", scrim, alt = "" } = props;
    const bg = el("div.dk-img", { role: "img", "aria-label": alt, "data-fit": fit });
    if (src) {
      bg.style.backgroundImage = `url("${src}")`;
      bg.style.backgroundPosition = focal;
    } else bg.setAttribute("data-empty", "Picture \u2014 set src");
    host.append(bg);
    if (scrim) host.append(el("div.dk-scrim", { "data-scrim": scrim }));
    return () => host.replaceChildren();
  });

  // framework/renderer.js
  function renderDeck(config, slidesEl) {
    slidesEl.replaceChildren();
    for (const slide of config.slides || []) {
      const section = document.createElement("section");
      const layoutFn = getLayout(slide.layout) || getLayout("content");
      const { mode, node } = layoutFn(slide, {});
      const fit = el("div.fit");
      if (mode === "bleed") fit.append(node);
      else fit.append(el("div.fit-inner", null, node));
      section.append(fit);
      if (slide.notes) section.append(el("aside.notes", null, slide.notes));
      slidesEl.append(section);
    }
  }

  // framework/fit.js
  function fitSlide(slide) {
    if (!slide) return;
    const frame = slide.querySelector(".fit");
    const inner = slide.querySelector(".fit-inner");
    if (!frame || !inner) return;
    inner.style.transform = "none";
    const fw = frame.clientWidth, fh = frame.clientHeight;
    const iw = inner.scrollWidth, ih = inner.scrollHeight;
    if (!fw || !fh || !iw || !ih) return;
    const scale = Math.min(fw / iw, fh / ih, 1);
    inner.style.transformOrigin = "center center";
    inner.style.transform = scale < 1 ? `scale(${scale})` : "none";
    inner.dataset.fitScale = scale.toFixed(3);
  }
  function fitAll() {
    document.querySelectorAll(".reveal .slides section").forEach(fitSlide);
  }
  var fitPlugin = {
    id: "fit",
    init(deck) {
      deck.on("ready", fitAll);
      deck.on("slidechanged", (e) => fitSlide(e.currentSlide));
      deck.on("resize", () => fitSlide(deck.getCurrentSlide()));
      window.addEventListener("deck-refit", fitAll);
    }
  };

  // framework/presenter.js
  var LS_THEME = "deckTheme";
  var LS_DEPTH = "deckDepth";
  var root = document.documentElement;
  function applyThemeInitial() {
    root.setAttribute("data-theme", localStorage.getItem(LS_THEME) === "dark" ? "dark" : "light");
  }
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  var depthLevels = [];
  var globalDepth = null;
  function initPresenter(deck, { remountVisualsIn: remountVisualsIn2 }) {
    const btn = el("button#deck-theme", { "aria-label": "Toggle theme", title: "Theme (T)" });
    const paintBtn = () => {
      btn.textContent = currentTheme() === "dark" ? "\u2600" : "\u263E";
    };
    paintBtn();
    const toggleTheme = () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem(LS_THEME, next);
      root.setAttribute("data-theme", next);
      paintBtn();
      remountVisualsIn2(deck.getCurrentSlide());
      window.dispatchEvent(new Event("deck-refit"));
    };
    btn.addEventListener("click", toggleTheme);
    document.body.append(btn);
    const BRANDS = ["editorial", "corporate-navy"];
    const cycleBrand = () => {
      const cur = root.getAttribute("data-deck-theme") || BRANDS[0];
      root.setAttribute("data-deck-theme", BRANDS[(BRANDS.indexOf(cur) + 1) % BRANDS.length]);
      remountVisualsIn2(deck.getCurrentSlide());
      window.dispatchEvent(new Event("deck-refit"));
    };
    const brandBtn = el("button#deck-brand", { "aria-label": "Cycle brand theme", title: "Brand theme" }, "\u2726");
    brandBtn.addEventListener("click", cycleBrand);
    document.body.append(brandBtn);
    const help = buildHelp();
    document.body.append(help);
    const toggleHelp = () => help.classList.toggle("open");
    depthLevels = orderedDepthLevels();
    globalDepth = localStorage.getItem(LS_DEPTH) || depthLevels[0] || null;
    deck.on("ready", () => {
      buildDepthTabs(deck);
      applyDepth(deck);
    });
    deck.on("slidechanged", () => applyDepth(deck));
    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && help.classList.contains("open")) {
        help.classList.remove("open");
        e.stopPropagation();
        return;
      }
      if (e.key === "?") return toggleHelp();
      if (e.key === "t" || e.key === "T") return toggleTheme();
      const idx = ["1", "2", "3", "4", "5"].indexOf(e.key);
      if (idx > -1 && depthLevels[idx]) setDepth(deck, depthLevels[idx]);
    });
  }
  function orderedDepthLevels() {
    const seen = [];
    document.querySelectorAll(".dk-depth").forEach((d) => {
      const lv = d.getAttribute("data-depth");
      if (lv && !seen.includes(lv)) seen.push(lv);
    });
    return seen;
  }
  function buildDepthTabs(deck) {
    document.querySelectorAll(".dk-layers").forEach((layers) => {
      if (layers.__tabs) return;
      const levels = [...layers.querySelectorAll(":scope > .dk-depth")].map((d) => d.getAttribute("data-depth"));
      const tabs = el(
        "div.dk-tabs",
        { role: "tablist", "aria-label": "Explanation depth" },
        levels.map((lv) => el("button.dk-tab", { role: "tab", "data-depth": lv, onclick: (ev) => {
          ev.stopPropagation();
          setDepth(deck, lv);
        } }, lv))
      );
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
    document.querySelectorAll(".dk-layers").forEach((layers) => {
      const panels = [...layers.querySelectorAll(":scope > .dk-depth")];
      let want = globalDepth;
      if (!panels.some((p) => p.getAttribute("data-depth") === want)) want = panels[0]?.getAttribute("data-depth");
      panels.forEach((p) => {
        const on = p.getAttribute("data-depth") === want;
        p.hidden = !on;
        p.setAttribute("role", "tabpanel");
      });
      layers.querySelectorAll(".dk-tab").forEach((t) => t.setAttribute("aria-selected", t.getAttribute("data-depth") === want ? "true" : "false"));
    });
    window.dispatchEvent(new Event("deck-refit"));
  }
  function buildHelp() {
    const rows = [
      ["\u2192 / \u2190", "Next / previous"],
      ["\u2193 / \u2191", "Within a stack"],
      ["1 / 2 / 3", "Depth for the whole deck"],
      ["?", "This help"],
      ["S", "Speaker window (notes + next + timer)"],
      ["F", "Fullscreen"],
      ["Esc / O", "Overview"],
      ["T", "Light / dark"],
      ["\u2726", "Brand theme (top-left control)"]
    ];
    return el(
      "div#deck-help",
      { onclick: (e) => {
        if (e.target.id === "deck-help") e.currentTarget.classList.remove("open");
      } },
      el(
        "div.dk-help-card",
        { role: "dialog", "aria-modal": "true", "aria-label": "Keyboard shortcuts" },
        el("h2", null, "Keyboard & presenter"),
        el("div.dk-help-grid", null, rows.flatMap(([k, v]) => [el("kbd", null, k), el("span", null, v)])),
        el("p.dk-muted", { style: { marginTop: "1rem" } }, "Press ? or Esc to close.")
      )
    );
  }

  // framework/chrome.js
  function initChrome(deck) {
    const counter = document.createElement("div");
    counter.id = "deck-counter";
    document.body.append(counter);
    const update = () => {
      const past = typeof deck.getSlidePastCount === "function" ? deck.getSlidePastCount() : deck.getIndices().h;
      counter.textContent = `${past + 1} / ${deck.getTotalSlides()}`;
    };
    deck.on("ready", update);
    deck.on("slidechanged", update);
  }

  // framework/index.js
  function mountVisualsIn(slide) {
    if (!slide) return;
    slide.querySelectorAll(".dk-visual-host").forEach((host) => {
      if (host.__mounted) return;
      const spec = host.__visual;
      const fn = spec && spec.component && getVisual(spec.component);
      if (!fn) return;
      host.__dispose = fn(host, spec, {});
      host.__mounted = true;
    });
  }
  function remountVisualsIn(slide) {
    if (!slide) return;
    slide.querySelectorAll(".dk-visual-host").forEach((host) => {
      if (host.__dispose) try {
        host.__dispose();
      } catch {
      }
      host.__mounted = false;
    });
    mountVisualsIn(slide);
  }
  function boot() {
    applyThemeInitial();
    const deckData = window.__DECK__ || { slides: [] };
    document.documentElement.setAttribute("data-deck-theme", deckData.theme || "editorial");
    document.title = deckData.title || "Deck";
    renderDeck(deckData, document.querySelector(".reveal .slides"));
    const plugins = [fitPlugin];
    if (window.RevealNotes) plugins.push(window.RevealNotes);
    if (window.RevealHighlight) plugins.push(window.RevealHighlight);
    window.Reveal.initialize({
      width: 1280,
      height: 720,
      margin: 0,
      minScale: 0.2,
      maxScale: 2,
      center: false,
      controls: false,
      progress: true,
      hash: true,
      transition: "fade",
      transitionSpeed: "fast",
      plugins
    });
    const afterShow = (slide) => {
      mountVisualsIn(slide);
      window.dispatchEvent(new Event("deck-refit"));
    };
    window.Reveal.on("ready", (e) => afterShow(e.currentSlide));
    window.Reveal.on("slidechanged", (e) => afterShow(e.currentSlide));
    initPresenter(window.Reveal, { remountVisualsIn });
    initChrome(window.Reveal);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

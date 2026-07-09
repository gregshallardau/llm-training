# Presentation Framework — Design

> **Status:** Design phase. Turns the [`RESEARCH.md`](./RESEARCH.md) verdict into a
> concrete architecture + design system satisfying every principle in
> [`PRINCIPLES.md`](./PRINCIPLES.md). The one gating unknown — *can a fit layer
> guarantee P1?* — was **proven** by a POC (`spikes/fit-layer/`): a dense/extreme
> slide is contained with **0 px overflow across 3 viewports × 2 themes (18/18)**.
> Nothing here is content-specific.

---

## 1. Architecture at a glance

A thin stack over an adopted engine. We build only the four shaded layers; the
engine gives us the rest.

```
┌──────────────────────────────────────────────────────────────┐
│  Deck config (YAML/JSON, declarative)      ← authors write this │
├──────────────────────────────────────────────────────────────┤
│  ░ Renderer: config → slides ░   ░ Component/Layout library ░   │  ← we build
│  ░ Fit layer (guarantees P1) ░   ░ Token→CSS theming ░          │  ← we build
├──────────────────────────────────────────────────────────────┤
│  Engine: reveal.js (vendored, offline)                          │  ← adopt
│  canvas scale · plugin registry · presenter window · keymap     │
└──────────────────────────────────────────────────────────────┘
```

- **Adopt (do not rebuild):** reveal.js — canvas transform-scale to viewport
  (P1 substrate + P13), plugin registry (P6), separate presenter window
  (`S` → speaker view: current+next+notes+timer) (P9), keyboard + overview.
  Plain-DOM + plugin path; the pre-1.0 React binding is deferred.
- **Build (the gap):** the fit layer, the config renderer, the component/layout
  library, and the token→CSS theming pipeline.

Everything we build registers through the engine's **plugin registry** — a plugin
is `{ id, init(deck), destroy() }`, added via config `plugins` or
`Reveal.registerPlugin`, retrieved via `Reveal.getPlugin(id)`. So layouts, visuals,
themes, and behaviours plug in **without touching core** (P6).

---

## 2. Authoring model — declarative deck config (P2/P3)

A deck is **data**, not markup or hand-styled HTML. Each slide names a `layout`
from the vocabulary and supplies content; interactivity is a **reference to a
registered component**. Layout, theme, and behaviour never leak into content.

```yaml
deck:
  title: Quarterly Review
  ratio: "16:9"                 # fixed frame (P1)
  theme: ./themes/acme.tokens.json   # or a built-in theme name (P4)
  slides:
    - layout: title
      eyebrow: ACME · FY26
      heading: Where we are
      subhead: One deck, any audience.

    - layout: split               # text + media, contained by construction
      media: right
      text: { heading: The shift, body: "..." }
      media:
        component: image          # registered visual
        src: assets/hero.jpg
        fit: cover
        focal: "center 40%"
        scrim: bottom             # legible text over image

    - layout: content
      heading: What changed
      blocks:
        - type: cards             # registered content block
          items:
            - { title: Faster, body: "..." }
            - { title: Cheaper, body: "..." }
      depths:                     # OPTIONAL layered content (P8)
        simple:   { blocks: [ ... ] }
        detailed: { blocks: [ ... ] }
        expert:   { blocks: [ ... ] }
      notes: "Speaker notes for the presenter window."   # (P9)

    - layout: visual              # full-bleed native interactive component (P7)
      component: chart
      props: { type: bar, series: [ ... ] }
```

The **renderer** walks this config and, per slide, emits a reveal `<section>`
wrapping the fit structure (below), instantiates the named **layout component**,
and mounts any referenced **visual components** from the registry. Config is
trivially generated/templated (a generator can emit it), satisfying flexibility.

---

## 3. Fit layer — the P1 guarantee (proven)

Two strategies, layered:

1. **Author-to-fit (primary).** Every layout is built to fill the fixed frame by
   construction — flex/grid regions, capped media, a spacing rhythm — so
   well-formed slides need no scaling (POC "normal" slide: scale = 1.000).
2. **Auto-shrink (guarantee/fallback).** A reveal plugin wraps each slide's content
   in `.fit` (the frame: `position:absolute; inset:0; overflow:hidden; flex-center`)
   › `.fit-inner` (natural content). On `ready`/`slidechanged`/`resize`/theme-change
   it measures the inner's natural size and applies
   `scale = min(frameW/innerW, frameH/innerH, 1)` — never upscales, centres the
   result. Measured in **layout px in the logical canvas**, unaffected by reveal's
   outer viewport transform, so the fit is computed once and holds at any resolution
   (P13). **Proven:** dense→0.764, extreme→0.806, 0 px overflow everywhere.

Algorithm lives in `spikes/fit-layer/fit.js` (POC) and becomes the production
`fit` plugin. This is the single most important thing we own.

---

## 4. Theming — DTCG tokens → CSS variables (P4)

- **Author** brand-neutral tokens as DTCG `*.tokens.json` (spec **2025.10**,
  pinned). A token has a required `$value`; `$type` is **optional and inherited
  from the closest parent group** (lift it to group level, don't repeat it). The
  8 primitive + 6 composite types cover colour, dimension, typography, shadow,
  gradient, duration, cubic-bezier — everything for full reskin.
- **Compile** tokens → CSS custom properties via a small build step (Style
  Dictionary or an equivalent), emitting `:root { --… }` and
  `:root[data-theme="dark"] { --… }`. Components only ever read `var(--…)` — they
  never contain colour/size literals. Reskinning or light/dark is a token swap;
  components don't change.
- **Validate** WCAG-AA contrast in the build (fail the build on violations) → P11.
- A theme is a drop-in file; the deck config's `theme:` selects it.

---

## 5. Component & layout library (P5)

Two registries, both plugged into reveal:

- **Layouts** (`title`, `split`, `image`, `quote`, `grid`, `content`, `compare`,
  `flow`, …): `render(slideData, ctx) → DOM`. Token-driven, accessible, sized to the
  frame. This is the fixed vocabulary authors choose from (P3).
- **Content blocks & visuals** (`cards`, `table`, `callout`, `chart`, `diagram`, …):
  `mount(el, props, { tokens, theme }) → dispose()`. Native DOM (no iframes/images),
  theme-aware, interactive (P7).

**Q5 (chart/UI libs), resolved by constraints, not hype:** anything adopted must be
(a) theme-driven by our tokens, (b) real DOM, (c) offline-bundlable. Default: build
core charts as **native SVG components** (full token control, zero runtime dep);
provide a thin **adapter** so a vendored charting lib can be dropped in for complex
cases without changing the component contract. Icons: a vendored SVG set. External
deps stay minimal and are pinned + vendored (P12).

---

## 6. Operation, presenter window & UI (P9/P10)

- **Presenter window (required):** reveal's speaker view — a second window
  (`window.open` → bundled speaker view) showing current + next slide, notes, and a
  timer, opened with `S`. Retained as-is; notes come from each slide's `notes:`.
- **Keymap** via `deck.addKeyBinding`: `→/←` next/prev, `↓/↑` within a module,
  `1/2/3` depth (P8), `?` help overlay, `F` fullscreen, `Esc/O` overview, `T` theme.
- **Slick chrome (P10):** replace reveal's dated arrow controls with a minimal,
  token-styled progress + optional jump affordance; purposeful motion, disabled
  under `prefers-reduced-motion`.

---

## 7. Layered / progressive content (P8, opt-in)

A slide may declare `depths: { simple, detailed, expert }`. The runtime renders one
at a time as an accessible **tablist** (`role=tablist/tab/tabpanel`,
`aria-selected`), switchable per-slide or **globally** (presenter picks the audience
level once; keys `1/2/3`; choice persisted). Slides without `depths` are unaffected.

---

## 8. Distribution & offline (P12)

- **Default: a self-contained folder** (`index.html` + vendored engine, compiled
  CSS, tokens, fonts, media) that runs from `file://`, a static host, or over Teams
  with no network. All third-party code is vendored + pinned.
- **Optional: single-file export** (assets inlined/base64) for maximum portability.
- The **presenter window works offline**: the speaker view is part of the bundle
  and opened as a second window; no CDN. (Single-file + second-window interaction is
  validated during build; folder mode is the reliable default.)

---

## 9. Principle → mechanism (no principle left "assumed")

| Principle | Mechanism |
|---|---|
| **P1** Guaranteed fit | Fixed reveal canvas + **fit layer** (author-to-fit + auto-shrink). **Proven 0-overflow.** |
| **P2** Separation | Config = content; layout = vocabulary; theme = tokens; behaviour = plugins. |
| **P3** Config-driven | Authors declare `layout` + content; renderer produces consistent DOM. No bespoke CSS. |
| **P4** One-place theming | DTCG tokens → CSS vars; components read `var(--…)` only; light/dark + brand = token swap. |
| **P5** Component library | Layout + block + visual registries, token-driven, accessible. |
| **P6** Pluggable | reveal plugin registry (`id/init/destroy`); layouts/visuals/themes register, core untouched. |
| **P7** Native interactivity | Visuals are DOM components (SVG charts / adapters), theme-aware, fit-scaled. |
| **P8** Layered content | Optional `depths` → ARIA tablist; per-slide + global; keys 1/2/3; persisted. |
| **P9** Presenter-first | reveal speaker window (current+next+notes+timer); coherent keymap; help overlay. |
| **P10** Slick UI | Minimal token-styled chrome replacing reveal controls; reduced-motion-aware motion. |
| **P11** Accessible | Build-time WCAG-AA token validation; ARIA; focus-visible; keyboard; reduced-motion. |
| **P12** Offline/portable | Self-contained folder (+ single-file export); everything vendored + pinned. |
| **P13** Deterministic | Fit computed in logical-canvas px (viewport-independent); reveal's fixed-canvas scale. |

---

## 10. Exemplar to build next (content-neutral)

A small, brand-neutral demo deck (~7 slides) exercising the whole system — **not**
LLM content:

1. `title` — cover. 2. `split`+`image` (with scrim). 3. `content`+`cards`.
4. `compare` (before/after). 5. `visual`+`chart` (native SVG, themed).
6. `content` with `depths` (simple/detailed/expert). 7. `quote`.

Delivered in **light + dark**, with speaker notes (to exercise the presenter
window), and driven by a single YAML deck config — proving authoring, theming, the
component library, the fit guarantee, layered content, and the presenter window
end-to-end before scaling to real decks.

---

## 11. Build plan (next phase, after approval)

1. Token pipeline + one brand-neutral theme (light/dark), with contrast validation.
2. Fit plugin (productionise the POC) + engine bootstrap.
3. Renderer (config → slides) + 3–4 core layouts.
4. Core content blocks + one native SVG chart + image component.
5. Layered content, presenter/keymap/help, slick chrome.
6. The exemplar deck + full Playwright verification (fit, a11y, themes, presenter).
7. Distribution build (folder + single-file) + docs (“how to add a layout / visual /
   theme”).

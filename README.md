# Presentation Framework

A **general-purpose, pluggable presentation framework** — build any deck, on any
topic, in any brand, from a single declarative config. This branch is the reusable
**base**: fork it, write a `deck.yaml`, and present. It carries no application
content of its own (the exemplar deck is a live reference you can keep, edit, or
delete).

Every slide is **guaranteed to fit its frame** — content auto-scales, never
overflows, never scrolls. Everything is **offline** (engine, fonts, charts, and map
data are vendored — Teams-safe), themed from **design tokens** (swap one file to
reskin), and driven by a small **component library** you extend without touching the
core.

## Quick start

```bash
npm install
npm run new -- my-talk    # scaffold decks/my-talk/ from the template
npm run build             # vendor engine + fonts, compile tokens→CSS (AA-validated),
                          # compile decks/*/deck.yaml→deck-data.js, bundle framework
npm run serve             # then open http://localhost:8090/decks/my-talk/
npm run export            # optional: one self-contained decks/my-talk/my-talk.html
```

Author guide: [`docs/AUTHORING.md`](./docs/AUTHORING.md). Start from the exemplar
([`decks/exemplar/deck.yaml`](./decks/exemplar/deck.yaml)) — it demonstrates every
layout, block, and visual.

## Presenter & keys

`→/←` next/prev · `↓/↑` within a stack · `1/2/3` depth · `?` help · **`S`** speaker
window (notes + next + timer) · `F` fullscreen · `Esc/O` overview · `T` light/dark ·
**`✦`** (top-left) cycles the brand. Chrome auto-hides when idle.

## What's in the box

- **Themes** (set `theme:` in the deck, or press `✦` to cycle): **editorial**
  (Fraunces serif, warm paper), **corporate-navy** (Inter, navy), **minimal**
  (neutral greys, indigo, sans). Each ships light + dark, WCAG-AA validated at build.
- **Layouts:** `title, section, split, image, visual, content, grid, compare, quote,
  statement`.
- **Blocks:** `cards, stats, kpi` (with sparklines)`, list, code, callout, flow,
  timeline, table`.
- **Visuals** (native, token-themed, no iframes): `chart` (bar/line), `donut`,
  `image`; and, via the vendored **Apache ECharts** adapter, `heatmap`, `map` (real
  geo bubbles), `timeseries` (zoomable), `sankey` (flow), plus a raw `echarts` escape
  hatch for any chart type.

## How it's built (maps to the principles)

| Piece | File(s) | Principle |
|---|---|---|
| Fixed frame + shrink-to-fit | `framework/fit.js` | P1, P13 |
| Declarative deck config (YAML) | `decks/*/deck.yaml` → `deck-data.js` | P2, P3 |
| DTCG tokens → CSS vars (+AA) | `framework/theme/` | P4, P11 |
| Layouts / blocks / visuals + registry | `framework/{layouts,blocks,visuals,registry}.js` | P5, P6, P7 |
| ECharts adapter (SVG, token-themed) | `framework/visuals.js` | P6, P7, P12 |
| Renderer (config → slides) | `framework/renderer.js` | P2, P3 |
| Presenter, depth, help, theme | `framework/presenter.js`, `framework/chrome.js` | P8, P9, P10 |
| Engine (adopted, vendored) | `vendor/` (reveal.js) | P9, P12, P13 |

The design rationale lives in [`PRINCIPLES.md`](./PRINCIPLES.md) (the 13 principles,
the source of truth), [`RESEARCH.md`](./RESEARCH.md) (unbiased landscape study +
adopt-vs-build verdict), and [`DESIGN.md`](./DESIGN.md) (architecture + schemas).

## Add a … (extension points, P6)

- **Layout** — `registerLayout(name, (data,ctx) => ({ mode, node }))` in `framework/layouts.js`.
- **Block** — `registerBlock(name, (props) => Element)` in `framework/blocks.js`.
- **Visual** — `registerVisual(name, (host,props) => dispose)` in `framework/visuals.js`
  (an ECharts visual is a few lines — see `sankey`/`heatmap`).
- **Theme** — drop in `<brand>.{light,dark}.tokens.json` (DTCG), add it to `BRANDS`
  in `framework/presenter.js`, rebuild to regenerate `tokens.css`.

Read colours and sizes only from CSS tokens (`var(--brand)` etc.) so components stay
theme-aware. Rebuild and the new component is usable from any `deck.yaml`.

> The original LLM lecture deck that used to live here is preserved on the `main`
> branch and in git history.

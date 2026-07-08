# Authoring guide

Build a deck by writing **`decks/<name>/deck.yaml`** — declarative data, no HTML or
CSS. `npm run build` compiles it; open `decks/<name>/` in a browser (or
`npm run export` for one self-contained file). Everything is offline.

```bash
npm install
npm run new -- my-talk     # scaffold decks/my-talk/
npm run build              # compile tokens + decks + framework
npm run serve              # then open http://localhost:8090/decks/my-talk/
npm run export             # optional: decks/my-talk/my-talk.html (single file)
```

## Deck shape

```yaml
title: My talk
ratio: "16:9"
theme: editorial          # editorial · corporate-navy · minimal
slides:
  - layout: <name>        # one layout per slide (see below)
    …layout props…
    notes: Speaker notes  # optional → presenter window
```

Every slide is guaranteed to **fit the frame** — content is auto-scaled if needed;
it never overflows.

## Layouts

| Layout | Props |
|---|---|
| `title` | `eyebrow`, `heading`, `subhead` |
| `section` | `kicker`, `heading`, `subhead` (divider) |
| `statement` | `text` (oversized; inline HTML ok) |
| `content` | `heading`, `blocks: [...]`, optional `depths:` (see Layered content) |
| `grid` | `heading`, `columns`, `blocks: [...]` |
| `split` | `mediaSide: left|right`, `text: {heading, body}`, `media: {component, …}` |
| `image` | `src`, `fit: cover|contain`, `focal`, `scrim: bottom|left|full`, `eyebrow`, `heading`, `body` |
| `visual` | `component` + its props (full-bleed; see Visuals) |
| `compare` | `heading`, `left: {title, items}`, `right: {title, items}` |
| `quote` | `text` (inline HTML ok), `cite` |

## Blocks (inside `content`/`grid`)

- `cards` — `items: [{title, body}]`
- `stats` — `items: [{value, label}]`
- `kpi` — `items: [{value, label, delta, spark: [numbers]}]`
- `list` — `items: [strings]`
- `callout` — `title`, `body`, `tone: brand`
- `flow` — `steps: [{title, body}]`
- `timeline` — `items: [{title, body}]`
- `code` — `lang`, `code` (syntax-highlighted, theme-aware)
- `table` — `columns: [...]`, `rows: [[...]]`

## Visuals (`layout: visual`, `component:` …)

Native, token-themed, no iframes:

- `chart` — `type: bar|line`, `labels`, `data`, `title`, `sub`
- `donut` — `title`, `sub`, `segments: [{label, value}]`
- `image` — `src`, `fit`, `focal`, `scrim`, `alt`

ECharts-backed (rich, token-themed via the adapter):

- `heatmap` — `xLabels`, `yLabels`, `data: [[row], …]`, `title`, `sub`
- `map` — `points: [{name, lng, lat, value}]` (bubbles on a world map), `title`, `sub`
- `timeseries` — `labels`, `series: [{name, data, area?}]`, `title`, `sub` (zoomable)
- `echarts` — `option: {…}` — a **raw ECharts option** (escape hatch for any chart type)

## Theming

Pick a brand with `theme:` (or press **✦** live to cycle). Toggle light/dark with
**T**. Themes are pure token files in `framework/theme/tokens/themes/` — colour,
type, spacing only; components never change. Add a brand by dropping in
`<brand>.light.tokens.json` + `<brand>.dark.tokens.json` (DTCG format) and adding it
to `BRANDS` in `framework/presenter.js`; `npm run build` validates WCAG-AA contrast.

## Presenter & keys

`→/←` next/prev · `↓/↑` within a stack · `1/2/3` depth · `?` help · **S** speaker
window (notes + next + timer) · `F` fullscreen · `Esc/O` overview · `T` light/dark ·
**✦** (top-left) brand.

## Layered content (optional)

```yaml
  - layout: content
    heading: One idea, three depths
    depths:
      simple:   { blocks: [ … ] }
      detailed: { blocks: [ … ] }
      expert:   { blocks: [ … ] }
```
Renders as an accessible tablist; `1/2/3` switch the depth for the whole deck.

## Extending the framework

Register against the component registries — no core changes:

```js
// framework/layouts.js
registerLayout('my-layout', (data, ctx) => ({ mode: 'flow', node: /* Element */ }));
// framework/blocks.js
registerBlock('my-block', (props) => /* Element */);
// framework/visuals.js
registerVisual('my-visual', (host, props) => { /* mount */ return () => {/* dispose */}; });
```

`mode: 'flow'` content is shrink-to-fit inside the frame; `mode: 'bleed'` fills it.
Read colours/sizes only from CSS tokens (`var(--brand)` etc.) so components stay
theme-aware. Rebuild and the new component is usable from any `deck.yaml`.

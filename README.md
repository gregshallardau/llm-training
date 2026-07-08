# Presentation Framework

A clean-slate project to design and build a **general-purpose, pluggable
presentation framework** — usable for any deck, any topic, any brand.

This branch is intentionally empty of application content. It starts from
**principles**, then **research**, then **design**, then **build**.

## Where we are

1. **Principles** — [`PRINCIPLES.md`](./PRINCIPLES.md). What the framework is and
   the principles it must hold to. Content-agnostic. This is the source of truth.
2. **Research** — [`RESEARCH.md`](./RESEARCH.md). A clean, sourced landscape study
   (unbiased: discovers the field before naming anything), adversarially fact-checked,
   with a build-vs-adopt recommendation. **Done** — recommends *adopt-and-extend a
   reveal.js-class engine*, add a custom fit layer for P1, use the engine's plugin
   registry for extensions, and standardize theming on the DTCG design-token format.
3. **Design** — [`DESIGN.md`](./DESIGN.md). Architecture + design system satisfying
   the principles; the pivotal P1 (guaranteed fit) risk was **proven** with a
   throwaway POC (`spikes/fit-layer/`, 0-overflow across 3 viewports × 2 themes).
   **Done.**
4. **Build** — **Done (first slice).** The framework is implemented and proven on a
   content-neutral exemplar (`decks/exemplar/`): 8 slides from a single YAML config,
   **48/48 fit checks (0-overflow) across 3 viewports × 2 themes, no console errors.**

## Build & run

```bash
npm install
npm run build     # vendors reveal.js, compiles DTCG tokens→CSS (AA-validated),
                  # compiles decks/*/deck.yaml→deck-data.js, bundles the framework
npx http-server . # or: python3 -m http.server — then open decks/exemplar/
```

Everything is vendored and offline-capable (Teams-safe). Presenter window: press `S`.
Keys: `→/←` nav · `1/2/3` depth · `?` help · `T` theme · `F` fullscreen · `Esc` overview.

## How it's built (maps to the principles)

| Piece | File(s) | Principle |
|---|---|---|
| Fixed frame + shrink-to-fit | `framework/fit.js` | P1, P13 |
| Declarative deck config (YAML) | `decks/*/deck.yaml` → `deck-data.js` | P2, P3 |
| DTCG tokens → CSS vars (+AA) | `framework/theme/` | P4, P11 |
| Layouts / blocks / visuals + registry | `framework/{layouts,blocks,visuals,registry}.js` | P5, P6, P7 |
| Renderer (config → slides) | `framework/renderer.js` | P2, P3 |
| Presenter, depth, help, theme | `framework/presenter.js` | P8, P9, P10 |
| Engine (adopted, vendored) | `vendor/` (reveal.js) | P9, P12, P13 |

## Add a … (extension points, P6)

- **Layout** — `registerLayout(name, (data,ctx) => ({ mode, node }))` in `framework/layouts.js`.
- **Block** — `registerBlock(name, (props) => Element)` in `framework/blocks.js`.
- **Visual** — `registerVisual(name, (host,props) => dispose)` in `framework/visuals.js`.
- **Theme** — add/point a `*.tokens.json` (DTCG); rebuild to regenerate `tokens.css`.

_Remaining in this phase:_ single-file (inlined) export for maximum portability;
the vendored-chart-lib adapter.

> The prior LLM lecture deck that used to live here is preserved on the `main`
> branch and in git history.

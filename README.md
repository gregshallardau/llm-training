# Working With AI & Copilot — presentation

This is the official [reveal.js](https://revealjs.com) project (v6.0.1, cloned
from [hakimel/reveal.js](https://github.com/hakimel/reveal.js)) with the
"Working With AI & Copilot" deck ported into `index.html`. It runs on
reveal.js's own dev server (Vite) rather than a plain static file server, so
you get its full toolchain — live reload, the standard build pipeline, etc.

The upstream project's own README is preserved at
`README-reveal.js-upstream.md`.

## Run it

```bash
npm install
npm start        # Vite dev server → http://localhost:8000
```

## Speaker notes

Press **`S`** with the deck focused. A second window opens showing:

- the current slide and a preview of the **next** slide,
- your **notes** for the current slide,
- a running **timer** and a clock.

Drag that window to a second display (or your laptop screen while a projector
mirrors the main deck) and present from it. Notes live in each slide's
`<aside class="notes">…</aside>`.

## Keys

| Key | Action |
|---|---|
| `→` / `←` , `Space` | next / previous |
| `S` | open the **speaker notes** window |
| `F` | fullscreen |
| `Esc` / `O` | slide overview |
| `?` | keyboard-shortcut help |

## What's ported vs. stock reveal.js

- `index.html` — reveal.js's own template (`dist/reset.css`, `dist/reveal.css`,
  `dist/theme/white.css`), the deck's custom CSS inlined in a `<style>` block,
  the deck's 28 `<section>` slides in `.slides`, and the deck's custom JS
  (the interactive widgets — next-word game, sliders, context-layer builder,
  folder tree, etc.) inlined after `Reveal.initialize(...)`.
- Only the **Notes** plugin is enabled (`plugins: [ RevealNotes ]`) — the deck
  doesn't use Markdown or syntax highlighting, so those stock plugin scripts
  were left out.
- Everything else (`dist/`, `css/`, `js/`, `plugin/`, `build/`,
  `vite.config.ts`, `package.json`, …) is unmodified upstream reveal.js —
  this stays a normal reveal.js project you can update from upstream.

# LLM Lecture Series — Presentation

An interactive, self-contained presentation on how large language models work and how to use them well. Built for professional audiences; industry-agnostic.

## Presenting

The deck is a static web app — no build step, no server dependencies, no internet required (all libraries are vendored).

**Option A — open directly:** open `present.html` in any modern browser.

**Option B — serve locally** (better for speaker view + navigation):

```bash
python3 -m http.server 8090
# then open http://localhost:8090/present.html
```

- `present.html` — the main deck (defaults to light theme; press `🌗` to toggle dark).
- `present-work.html` — a re-skinned variant (light theme, work-branded example).
- `index.html` — full-content reference deck (everything, long form).
- `LLM-Series-Backup-Deck.pdf` / `backup-deck.md` — linear fallback to present from if the interactive deck ever fails.

## Presenting tips

- **Speaker view:** press `S` to open speaker notes in a second window (put it on your laptop screen, the deck on the projector).
- **Navigation:** arrow keys — `→` next concept, `↓` deeper (the three depth tracks: Plain English / Technical / PhD).
- **Widgets & visuals:** interactive demos (tokeniser, hallucination trap, etc.) and diagrams open in-slide; some launch full-screen.
- **Jump menu:** the overview slide links to any module.

## Theming

`theme.css` holds all colours/fonts as CSS variables — edit the marked block to re-skin. `theme-work-example.css` shows a light/branded variant. Drop a `logo.png` beside the deck and it appears on each slide.

## Structure

- `visuals/` — per-module diagrams and interactive HTML pieces (embedded by the deck).
- `vendor/` — pinned copies of reveal.js + mermaid + plugins (offline-safe).

## Content

Content spans ~24 modules (tokenisation, attention, context windows, prompting, RAG, agents, privacy, model choices, and a practical Copilot lab). Presenter adapts live; the deck carries the visuals and examples.

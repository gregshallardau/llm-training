# Working With AI & Copilot — presentation

A self-contained [reveal.js](https://revealjs.com) deck with full speaker notes.
Everything is vendored locally under `reveal/` (reveal.js 4.5.0 + the Notes
plugin) — **no internet connection is needed**, so it runs fine on a locked-down
corporate network or inside Teams.

## Run it

The speaker view needs the deck served over `http://` (a pop-up window plus
`localStorage` — these don't work from a bare `file://` path). Any static
server works; from this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

or with Node:

```bash
npx serve .        # then open the URL it prints
```

## Speaker notes

Press **`S`** with the deck focused. A second window opens showing:

- the current slide and a preview of the **next** slide,
- your **notes** for the current slide,
- a running **timer** and a clock.

Drag that window to a second display (or your laptop screen while the projector
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

## Files

```
index.html                     the deck (content + notes inline)
reveal/                        vendored reveal.js 4.5.0
  reveal.min.css
  theme/white.min.css
  reveal.min.js
  plugin/notes/notes.min.js    speaker-notes plugin
```

# DeckKit — Presentation Design Guide

Research-backed design system for the LLM Lecture Series deck. This is the
reference that governs how slides are laid out, how depth-layered content works,
and — importantly — **how you drop a picture into a slide** in a controlled,
repeatable way.

Sources are listed at the end.

---

## 1. Design principles (what the research says)

| Principle | Rule of thumb we follow |
|---|---|
| **One idea per slide** | A slide makes a single point. Split, don't cram. |
| **Grid + rule of thirds** | Everything sits on a grid; focal points land on third-lines, not dead-centre. |
| **Whitespace is a feature** | Keep ≥15–20% of the slide empty. Wider margins, fewer elements. |
| **Visual hierarchy** | Size → colour → contrast → position guide the eye. One dominant element per slide. |
| **Restraint** | ≤2 typefaces, 3–5 colours. We use Inter + JetBrains Mono and a tokenised palette. |
| **Contrast / accessibility** | Text meets WCAG AA: 4.5:1 (body), 3:1 (large). Focus states + alt text everywhere. |

These map onto **design tokens** (`deck-tokens.css`) so the whole deck is
re-skinnable from one place, and onto a small set of **layout components**
(`deck.css`) so every slide is built from the same vocabulary.

---

## 2. Slide layouts

The framework ships a fixed vocabulary of layouts. A slide picks one; it never
free-forms. This is what keeps 24 modules visually consistent.

| Layout | Use for | Key regions |
|---|---|---|
| `title` | Module opener + launchpad | eyebrow · H1 · hook · jump buttons |
| `layers` | Teaching content | heading · depth tabs (Plain/Tech/PhD) · body |
| `visual` | Full-bleed native diagram/demo | edge-to-edge component, no card |
| `split` | Text + picture side by side | 2 columns, ratio configurable |
| `image` | Hero / section / emotional | full-bleed picture + optional scrim + text |
| `cards` | Parallel items (e.g. WHO/WHAT/…) | responsive grid of equal cards |
| `compare` | With/without, before/after | two contrasting columns |
| `flow` | Sequential steps | steps joined by arrows |
| `quote` | Callout / key insight | oversized statement + attribution |

Every layout is responsive (scales with reveal's 16:9 canvas) and theme-aware
(light default, dark on toggle / `prefers-color-scheme`).

---

## 3. Pictures — the configuration model

This is the "a place to configure a picture into a slide" you asked for. Images
are **declared, not hand-styled**. Two mechanisms, mirroring how reveal.js and
Slidev do it:

### 3a. Full-bleed background image — `layout: image`
For hero/section slides where the picture *is* the message.

```html
<section class="deck-slide" data-layout="image"
         data-image="assets/img/warehouse.jpg"
         data-fit="cover"            <!-- cover | contain -->
         data-focal="center 30%"      <!-- rule-of-thirds focal point -->
         data-scrim="bottom">         <!-- none | full | bottom | left | gradient -->
  <div class="slide-figtext">
    <h2>Insurance runs on documents</h2>
  </div>
</section>
```

- **`data-scrim`** solves the #1 full-bleed problem — legibility. It lays a
  token-driven overlay so text stays ≥4.5:1 contrast: `full` = 50% wash,
  `bottom` = dark band over bottom third, `gradient` = transparent→dark.
- **`data-focal`** = CSS `object-position`; keep faces/subjects on a third-line.

### 3b. Inset / split picture — `layout: split` or a `<figure>` component
For a picture that supports the text rather than replacing it.

```html
<figure class="deck-figure" data-fit="cover" data-frame="card">
  <img src="assets/img/broker-desk.jpg" alt="A broker reviewing a renewal file">
  <figcaption>Renewal review, the manual way</figcaption>
</figure>
```

- **Aspect-ratio box** (`aspect-ratio` CSS) reserves space → no layout shift, no
  squashing; `data-fit` picks `cover`/`contain`.
- **`data-frame`** = `none | card` (rounded + subtle border/shadow from tokens).
- **`alt` is required** (accessibility + it doubles as the author's note).

### 3c. Placeholder-first authoring
If `data-image`/`src` is empty, the framework renders a **labelled placeholder**
(dashed box: "🖼 Picture — set data-image"). You lay the slide out first and drop
the real asset in later, without breaking the design. Images live in
`assets/img/` and are referenced by path (works offline over `file://`).

### 3d. Rules baked in
- High-res only (≥1920×1080 for full-bleed); prefer simple compositions with
  flat areas for text.
- Never bake essential text into a raster; keep it as real HTML over the image.
- Decorative images get empty `alt=""`; meaningful ones get descriptive alt.

---

## 4. Depth-layered content

The Plain / Technical / PhD tracks become first-class, accessible tabs
(`role=tablist/tab/tabpanel`, `aria-selected`), switchable per-slide **or**
globally (presenter picks the audience level once; keys `1/2/3`). Transitions are
a short crossfade that collapses to an instant swap under
`prefers-reduced-motion`.

---

## 5. Motion & operation
- Transitions and hovers use tokenised durations/easings; all disabled under
  `prefers-reduced-motion`.
- Full keymap surfaced in a `?` help overlay: `→/← · ↓/↑ · 1/2/3 · ? · S speaker
  · F fullscreen · Esc overview · T theme`.

---

## Sources
- [Presentation design best practices 2026 — presentations.ai](https://www.presentations.ai/blog/presentation-design-best-practices)
- [Working with whitespace — BrightCarbon](https://www.brightcarbon.com/blog/presentation-whitespace/)
- [PowerPoint design guide — Deckary](https://deckary.com/blog/pillar-powerpoint-design-guide)
- [Image-focused full-bleed layouts — pptx.gallery](https://www.pptx.gallery/how-to/image-focused-full-bleed-layouts)
- [Place, size, and overlay images — pptx.gallery](https://www.pptx.gallery/how-to/images-placement-sizing-overlays)
- [Ensure high contrast for text over images — Nielsen Norman Group](https://www.nngroup.com/articles/text-over-images/)
- [Designing accessible text over images — Smashing Magazine](https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/)
- [Text in images: accessibility — Level Access](https://www.levelaccess.com/blog/content-over-images-how-does-this-ux-ui-trend-impact-accessibility/)
- [reveal.js backgrounds](https://revealjs.com/backgrounds/) · [Slidev layouts](https://sli.dev/builtin/layouts)

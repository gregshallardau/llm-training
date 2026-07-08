# Presentation Framework — Design Principles

> A working draft distilled from what you've asked for. It defines **what the
> framework is and the principles it must hold to** — not how it's built. Nothing
> here is content-specific: the LLM deck is just one consumer. Edit freely; this
> is the spec we'll research against and build from.

---

## 0. What this is

A **general-purpose, pluggable presentation framework**. You bring content and a
theme; the framework gives you slides that are reliable, beautiful, interactive,
and presenter-ready — for any topic, any brand. It should feel like a modern,
programmable replacement for battle-tested PowerPoint: at least as **dependable**,
and better at **interactivity, theming, and reuse**.

---

## 1. Core principles

**P1 — Fixed frame, guaranteed fit.**
Every slide is a fixed canvas (16:9 by default). Content is *always* contained and
balanced within it — never spilling off the page, never requiring a scroll. Like
PowerPoint's slide boundary. If content is too big, the framework fits it; it does
not overflow.

**P2 — Content, layout, theme, and behaviour are separate.**
The same content can be restyled or re-themed without editing it. Content is
declarative; layout is chosen from a vocabulary; theme is data (tokens); behaviour
is the runtime. No one concern is tangled in another.

**P3 — Config-driven, not hand-styled.**
Authors *declare* intent (a layout, an image, a chart, a depth level) and the
framework renders it consistently. You should almost never write bespoke CSS to
make a slide look right.

**P4 — Themeable from one place.**
All colour, type, spacing, motion live in **design tokens**. Reskinning to any
brand — or switching light/dark — changes tokens only, never components. The
framework ships brand-neutral; a theme is a drop-in.

**P5 — A real component library.**
Slides are assembled from reusable, tested components: layouts (title, split,
image, quote, grid…), content blocks (cards, compare, flow, callout, table), and
data/visual components (charts, diagrams). Components are consistent, accessible,
and theme-aware by default.

**P6 — Pluggable and extensible.**
New layouts, components, visuals, themes, and behaviours can be added **without
touching the core**. There is a clear extension point (a registry) for custom
interactive visuals and third-party libraries. The framework is a platform, not a
fixed template.

**P7 — Interactivity is native.**
Interactive pieces (demos, charts, diagrams, widgets) are first-class DOM
components — not screenshots, not embedded iframes. They inherit the theme, scale
to the frame, and respond to input. External chart/UI libraries are welcome where
they earn their place; a build step is acceptable to manage them.

**P8 — Layered / progressive content (optional).**
A slide can carry the *same idea at multiple depths* (e.g. simple → detailed →
expert) that the presenter switches between live — per slide or for the whole
deck. This is an opt-in capability, not a requirement of every deck.

**P9 — Presenter-first operation.**
Built for someone driving it live: a coherent keyboard model, an on-demand
shortcut/help overlay, jump-to navigation, and an overview. Operation must feel
effortless and predictable. A dedicated **presenter window** (a separate speaker
view — current + next slide, speaker notes, and a timer/clock) is a **required,
retained feature**, not optional.

**P10 — Slick, restrained UI.**
Navigation and chrome are minimal and refined — no dated, clunky controls. Motion
is purposeful and subtle. Whitespace and a consistent spacing rhythm do the heavy
lifting. Nothing on screen competes with the content.

**P11 — Accessible by default.**
WCAG-AA contrast, real keyboard operability, ARIA semantics for interactive parts,
visible focus, and `prefers-reduced-motion` support — in every theme.

**P12 — Portable and offline.**
Runs from a single place with no internet dependency (presenting over Teams, a
projector, or a plane). All assets — fonts, libraries, media — are self-contained.

**P13 — Reliable and predictable.**
It behaves the same on every machine and screen size. No layout surprises, no
"works on my display." Determinism is a feature.

---

## 2. Non-goals (for now)

- Not a WYSIWYG drag-and-drop editor.
- Not tied to any one topic, brand, or the current LLM deck.
- Not reinventing what a mature slide engine already does well (transitions,
  speaker view, PDF export) — we build *on* proven foundations.

---

## 3. Open questions for the research phase

To be resolved cleanly with research + your input, **before** any building:

0. **Landscape scan (do this first)** — search online for existing presentation
   frameworks, engines, tools, and libraries we could **adopt, integrate, or build
   on instead of reinventing**. Evaluate the field (e.g. reveal.js, Slidev, Marp,
   Spectacle, WebSlides, remark, Motion Canvas, Sli.dev-style tooling) plus
   component / chart / theming libraries, against these principles. Bias strongly
   toward incorporating proven solutions; only build what nothing existing gives us.
1. **Authoring model** — how does an author declare a deck? (Structured data /
   config vs markup vs markdown.) What's the most flexible, low-friction format?
2. **Rendering foundation** — build on an existing engine (e.g. reveal.js) or a
   thin custom core? Trade-offs for P1/P6/P13.
3. **Fit strategy** — how exactly do we guarantee P1 (author-to-fit vs
   auto-scale-to-fit vs both)?
4. **Extension API** — what's the contract for plugging in a new layout, visual,
   or theme? (P6)
5. **Component & chart libraries** — which, if any, to standardise on. (P5/P7)
6. **Theming schema** — the exact token taxonomy for full reskinnability. (P4)
7. **Distribution** — single-file, folder, or package? How is a deck shared and
   presented? (P12)

---

## 4. How we'll work

1. **Principles** (this file) — agree what we're building and why.
2. **Research** — a clean, sourced study that **first scans the field online for
   existing frameworks, tools, and solutions we can incorporate or build on** (not
   reinvent), then works through the open questions above and best-in-class design
   practice. Output: a cited report with a clear build-vs-adopt recommendation.
3. **Design** — an architecture + design system that satisfies these principles.
4. **Build** — implement, proving it on a small exemplar before scaling.

_Add, cut, or reword any principle — this should read as **your** principles._

# Presentation Framework — Landscape Research & Build-vs-Adopt Recommendation

> **Status:** Research phase complete. This is the cited landscape study called for by
> [`PRINCIPLES.md`](./PRINCIPLES.md) §3–4. It was produced by an unbiased, multi-source
> scan (the field was enumerated from primary sources before any product was named), with
> every load-bearing claim adversarially fact-checked (3-vote verification) against primary
> sources. Method stats: 6 search angles → 25 sources fetched → 58 claims extracted →
> 25 verified → **24 confirmed, 1 refuted**.
>
> **Bottom line:** **Adopt-and-extend a reveal.js-class engine**, add a thin custom
> **author-to-fit + auto-scale hybrid layout layer** to close the one principle no engine
> satisfies out of the box (P1, guaranteed content fit), expose our own layouts/visuals
> through the engine's **plugin registry**, and standardize theming on the **DTCG design-token
> format**. Build only the fit layer and the authoring/theming layers on top — do not
> reinvent the rendering engine, presenter window, or plugin system.

---

## 0. The landscape (discovered, not pre-seeded)

The open-source presentation field is dominated by **JavaScript/HTML5 slide engines**, with a
second tier of markup/code-based authoring tools:

| Tool | Class | Authoring | Note |
|------|-------|-----------|------|
| **reveal.js** | HTML5 engine | HTML / Markdown / (React binding) | De-facto standard (~67–72k★); mature plugin API, speaker view |
| **Slidev** | Dev tool on Vue | Markdown + Vue + HTML | Fastest-growing dev-oriented (~31–48k★); live coding, diagrams, drawing |
| **impress.js** | HTML5 engine | HTML | Canvas/zoom-based |
| **Spectacle** | React | JSX/React | React-native slides |
| **Marp** | Markdown | Markdown → HTML/PDF/PPTX | Export-focused |
| **remark.js** | HTML5 engine | Markdown | Lightweight |
| **Bespoke.js / deck.js / dzslides / shower** | HTML5 engines | HTML | Older / niche |
| **MDX Deck** | React + Markdown | MDX | **Unmaintained** |
| **Beamer** | LaTeX | LaTeX | Academic, non-web |

reveal.js is repeatedly cited as the de-facto standard; Slidev is the leading developer-oriented
Markdown+component tool. An independent practitioner review narrowed a real selection to
Fusuma / reveal.js / Slidev and chose Slidev over reveal.js — confirming these two are the
serious contenders for a config/component-driven framework.
[[1]](#s1) [[2]](#s2) [[3]](#s3) [[5]](#s5)

**Build-vs-adopt verdict: ADOPT-AND-EXTEND.** No surveyed engine satisfies all 13 principles
out of the box, but reveal.js already delivers P6 (plugin registry), P7 (official React DOM
binding), P9 (separate speaker window), and the P1/P13 scaling substrate — none of which is
worth rebuilding. The general software-engineering case against rolling your own framework
(the hidden cost of self-maintenance and re-solving solved problems) points the same way,
though that source is a single non-empirical opinion and only *directional*. [[9]](#s9)
Adoption pays off **only** for the principles the engine already meets; the gaps (chiefly P1)
we build ourselves on top.

---

## 1. Answers to the open questions

### Q0 — Landscape scan + build-vs-adopt
See §0. **Adopt a reveal.js-class engine; build a fit layer, an authoring/config layer, and a
token-theming layer on top.**

### Q1 — Authoring model (structured data/config vs markup vs markdown)
Markdown-plus-component authoring with first-class interactivity is **production-proven** by
Slidev (Markdown → Vue/HTML with live code, LaTeX, Mermaid, icons, presenter mode).
[[8]](#s8) But markup/markdown tools tend to embed layout and style **inline**, which works
against P2/P3 (content/layout/theme/behaviour separation; declare intent, not bespoke CSS).
**Recommendation: a structured-config / data-driven authoring model** (author declares a
layout + content + depth level) rendered through the adopted engine — not free-form markup and
not hand-written CSS. _(Confidence: medium — the separation-of-concerns preference is inferred
from our principles, not from a cited comparative study.)_

### Q2 — Rendering foundation (adopt engine vs thin custom core)
**Adopt.** reveal.js provides a fixed-canvas scaling model (P1/P13 substrate), a plugin
registry (P6), and — decisively for P7 — an **official React binding** (`@revealjs/react`,
maintained by the reveal.js creator) that renders slides as **real React DOM components**, not
screenshots or iframes. [[3]](#s3) Caveat: the React binding is **pre-1.0 (v0.2.1) and
immature** — treat it as promising, not battle-tested; the plain-DOM/plugin path is the safer
default and the React binding an opt-in.

### Q3 — Fit strategy (author-to-fit vs auto-scale-to-fit vs both)
**Both — a hybrid, and this is the one place we must build.** reveal.js gives us
*auto-scale-to-fit of the whole canvas*: a fixed logical canvas (default 960×700) is uniformly
transform-scaled to the viewport preserving aspect ratio (margin 0.04, minScale 0.2, maxScale
2.0). This is a deliberate 2013 architectural choice by the creator (issue #310) and delivers
deterministic, resolution-independent rendering (P13). [[4]](#s4) **But it does not scale
*content to the canvas*:** with dense content at 1920×1080, images and text overflow
`div.slides` in both Firefox and Chromium; the built-in `max-height:95%` constraint has no
effect (95% is relative to the container, not the viewport); and the helpers
`r-fit-text` (text-to-width only), `r-stretch` (one element, vertical only), and 5.0's
`scroll-view` (scrolls, doesn't fit) **mitigate but do not guarantee** no-overflow.
[[6]](#s6) **Therefore P1 requires a custom fit layer** — measure rendered content and
author-to-fit (or auto-shrink) it *within* the canvas — layered on top of reveal's
canvas-to-viewport scale. This is the single most important thing we build.

### Q4 — Extension API (contract for layouts/visuals/themes)
**Use the engine's plugin registry.** A reveal.js plugin is a plain object with a required
string `id` and optional `init(deck)` / `destroy()`. Plugins register declaratively via the
config `plugins` array or at runtime via `Reveal.registerPlugin(...)`, and are retrievable by
id via `Reveal.getPlugin(id)` / `getPlugins` / `hasPlugin` — a genuine registry (verified
against docs and `js/controllers/plugins.js`). `init(deck)` receives the deck instance and can
hook the full API (`deck.addKeyBinding(...)`, etc.). This directly satisfies P6 and gives us a
ready-made contract for plugging in custom layouts, interactive visuals, and behaviours
**without touching core**. [[2]](#s2) Our layouts/visuals/themes register as plugins (or
plugin-provided components) against this registry.

### Q5 — Component & chart libraries
**No verified, high-confidence recommendation emerged** — the chart/UI-library sources
surfaced (LogRocket "best React chart libraries", shadcn/Radix comparisons, etc.) were rated
**unreliable** and produced zero surviving claims, so this question is deferred to the design
phase rather than answered on weak evidence. Constraints from the principles still hold:
whatever we pick must be theme-aware via tokens (P4/P5), render as real DOM (P7), and be
offline-bundlable (P12). _(Open item — see §3.)_

### Q6 — Theming / design-token schema
**Standardize on the DTCG (W3C Design Tokens Community Group) format.** It reached its **first
stable version, 2025.10, on 28 Oct 2025** — a production-ready, vendor-neutral JSON format.
[[7]](#s7) It defines a **closed set of 8 primitive types** (color, dimension, fontFamily,
fontWeight, duration, cubicBezier, number, string) and **6 composite types** (border,
strokeStyle, transition, shadow, gradient, typography) — covering color/typography/spacing/
shadow/gradient, i.e. everything needed for full reskinnability (P4). Reference implementations
exist (Style Dictionary, Tokens Studio, Terrazzo) and adopters include Figma, Penpot, Sketch,
Framer. **Schema shape (corrected — see §2):** a token is a JSON object keyed by name with a
**required `$value`** and an **optional `$type` and `$description`**; `$type` is **inheritable
from the closest parent group**, so lift it to the group level rather than repeating it on
every token. Files use `.tokens` / `.tokens.json` and media type
`application/design-tokens+json`. Caveats: it is a **Community Group Report, not a ratified W3C
Recommendation**, and reserves room for future breaking changes — pin a version.

### Q7 — Distribution & offline presenting
**No verified claim survived on the distribution mechanics specifically** (the Slidev-export
and Quarto-presenting sources were rated unreliable). What *is* verified and relevant: the
presenter window is a real second browser window opened via `window.open(...)` rendering a
separate `speaker-view.html` (current slide + next-slide preview + notes + timer), opened with
`S`. [[10]](#s10) [[11]](#s11) The P12 single-file/offline distribution answer — and how an
embedded second-window presenter view survives a self-contained bundle — is **deferred to the
design phase** rather than asserted on weak evidence. _(Open item — see §3.)_

---

## 2. What the fact-check killed (and corrected)

One claim was **refuted 0-3** and is worth calling out because it would otherwise have gone
straight into the design:

> ❌ *"The DTCG token schema requires each token to declare `$value` **and `$type`**."*

The normative DTCG Format Module makes **`$type` optional per token** — if absent, a token's
type is inherited from the closest parent group with a `$type` (or resolved from a referenced
token). Only `$value` is strictly required per token. Standardizing on "each token declares
`$type`" would have encoded an incorrect constraint and thrown away the spec's group-level
type-inheritance idiom. **Corrected guidance is in Q6 above.** [[7]](#s7)

---

## 3. Open items carried into the Design phase

These were **not** settled by the research (either no source, or only unreliable sources), and
must be resolved in design rather than assumed:

1. **Can a fit layer on top of reveal.js/Slidev truly guarantee P1 no-overflow for arbitrary
   dense content — or does guaranteed fit ultimately require a thin custom core?** This is the
   pivotal architectural risk. The recommendation assumes a fit layer suffices; design must
   prototype and prove it.
2. **Which engine better supports a structured-config/data-driven authoring model (P2/P3)
   natively**, and how much DTCG-token theming (P4) can be wired through each engine's existing
   CSS-variable/theme system without forking core.
3. **The concrete Q7 distribution answer:** can either engine emit a self-contained single-file
   offline deck (P12) *with* the embedded second-window presenter view, and the trade-offs vs a
   folder/package build.
4. **P11 (WCAG-AA) and P8 (layered/progressive-depth content)** were not covered by any
   surviving claim — neither is evidenced as met by any candidate and both need explicit design.
5. **Component & chart library selection (Q5)** — deferred; decide in design against the
   P4/P5/P7/P12 constraints.

---

## 4. Methodology & caveats

- **Unbiased scan:** angles were framed around capabilities (landscape enumeration, authoring/
  rendering, fixed-canvas fit, theming/tokens/components, presenter/distribution, and a
  deliberate contrarian *skeptical build-vs-adopt* angle) — the field was enumerated from
  curated primary lists before any product was named.
- **Adversarial verification:** each load-bearing claim was checked by 3 independent verifiers;
  a claim needed 2/3 refutes to be killed. 24/25 confirmed, 1 refuted (§2).
- **Fetch caveats:** several primary URLs (revealjs.com, w3.org, designtokens.org) returned
  HTTP 403 to direct fetch through the proxy; those claims were verified from WebSearch-extracted
  page text **plus** corroborating sources and, where possible, primary **source code** (the
  reveal.js repo, the npm registry) — content matched. This is a methodological caveat, not a
  factual gap.
- **Time-sensitivity:** `@revealjs/react` is pre-1.0 (v0.2.1) and immature; the DTCG spec is a
  Community Group Report, not a ratified standard, and may make breaking changes — pin versions.
  Star counts from blog sources are stale (directionally conservative).
- **Honest limit:** **no source establishes that any surveyed engine satisfies all 13
  principles out of the box.** The strongest candidate (reveal.js) demonstrably fails P1
  natively. The build-vs-adopt recommendation is a synthesis judgment from the assembled
  evidence, not a claim any single source makes.

---

## 5. Sources

<a id="s1"></a>**[1]** Awesome-presentation-tools (curated list) — https://github.com/runablehq/Awesome-presentation-tools _(secondary)_
<a id="s2"></a>**[2]** reveal.js — Creating Plugins (plugin registry API) — https://revealjs.com/creating-plugins/ · source: https://github.com/hakimel/reveal.js _(primary)_
<a id="s3"></a>**[3]** reveal.js — React binding `@revealjs/react` — https://revealjs.com/react/ · https://registry.npmjs.org/@revealjs/react _(primary)_
<a id="s4"></a>**[4]** reveal.js — Presentation Size (auto-scale-to-fit) — https://revealjs.com/presentation-size/ · https://github.com/hakimel/reveal.js/issues/310 _(primary)_
<a id="s5"></a>**[5]** Choosing a slide library (practitioner comparison; chose Slidev) — https://tonai.github.io/blog/posts/slide-libraries/ _(blog)_ · https://byby.dev/js-presentation-libs _(blog)_
<a id="s6"></a>**[6]** reveal.js content-overflow / fit gap — issues https://github.com/hakimel/reveal.js/issues/1894 · /issues/2342 · /issues/2261 _(primary/forum)_
<a id="s7"></a>**[7]** DTCG Design Tokens Specification, first stable version 2025.10 — https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/ · https://www.designtokens.org/tr/drafts/format/ _(primary)_
<a id="s8"></a>**[8]** Slidev (Markdown + Vue/HTML, interactive authoring) — https://github.com/slidevjs/slidev _(primary)_
<a id="s9"></a>**[9]** "Don't build your own framework" (directional opinion) — https://dodov.dev/blog/dont-build-your-own-framework _(blog)_
<a id="s10"></a>**[10]** reveal.js — Speaker View — https://revealjs.com/speaker-view/ _(primary)_
<a id="s11"></a>**[11]** reveal.js speaker-view window (`window.open` → speaker-view.html) — https://github.com/hakimel/reveal.js _(primary)_

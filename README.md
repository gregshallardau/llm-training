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
4. **Build** — implement, proving it on a small content-neutral exemplar before
   scaling. _Next._

No framework code is written until the research is done and approved.

> The prior LLM lecture deck that used to live here is preserved on the `main`
> branch and in git history.

/* Component registries. Layouts, content blocks, and interactive visuals all
   plug in here — the extension point (P6). Nothing in core references a concrete
   layout/visual by name; everything is looked up. */
const layouts = new Map();   // name -> render(slideData, ctx) -> { mode:'flow'|'bleed', node }
const blocks = new Map();    // name -> build(props, ctx) -> Element
const visuals = new Map();   // name -> mount(el, props, ctx) -> dispose()

export const registerLayout = (name, fn) => layouts.set(name, fn);
export const registerBlock = (name, fn) => blocks.set(name, fn);
export const registerVisual = (name, fn) => visuals.set(name, fn);

export const getLayout = (name) => layouts.get(name);
export const getBlock = (name) => blocks.get(name);
export const getVisual = (name) => visuals.get(name);
export const hasVisual = (name) => visuals.has(name);

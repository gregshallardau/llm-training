/* DeckKit build:
   1. vendor reveal.js dist (offline / Teams-safe)
   2. compile DTCG tokens → framework/theme/tokens.css (with AA validation)
   3. compile each decks/<name>/deck.yaml → deck-data.js (window.__DECK__, no fetch)
   4. bundle the framework (ES modules) → dist/framework.js (classic IIFE)
   Run: npm run build */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';
import { load } from 'js-yaml';
import { build } from 'esbuild';
import { compileTokens } from './framework/theme/build-tokens.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const R = (...p) => join(root, ...p);

// 1. vendor reveal + plugins + fonts (offline)
mkdirSync(R('vendor/plugin'), { recursive: true });
mkdirSync(R('vendor/fonts'), { recursive: true });
copyFileSync(R('node_modules/reveal.js/dist/reveal.js'), R('vendor/reveal.js'));
copyFileSync(R('node_modules/reveal.js/dist/reveal.css'), R('vendor/reveal.css'));
copyFileSync(R('node_modules/reveal.js/dist/plugin/notes.js'), R('vendor/plugin/notes.js'));
copyFileSync(R('node_modules/reveal.js/dist/plugin/highlight.js'), R('vendor/plugin/highlight.js'));
for (const [pkg, file] of [
  ['@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2'],
  ['@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2'],
  ['@fontsource-variable/inter', 'inter-latin-wght-normal.woff2']
]) copyFileSync(R('node_modules', pkg, 'files', file), R('vendor/fonts', file));
console.log('  ✓ vendored reveal.js + notes + highlight + fonts');

// 2. tokens
compileTokens(R('framework/theme/tokens.css'));

// 3. decks: yaml → deck-data.js
const decksDir = R('decks');
if (existsSync(decksDir)) {
  for (const name of readdirSync(decksDir)) {
    const yml = R('decks', name, 'deck.yaml');
    if (!existsSync(yml)) continue;
    const data = load(readFileSync(yml, 'utf8'));
    writeFileSync(R('decks', name, 'deck-data.js'), `window.__DECK__ = ${JSON.stringify(data, null, 2)};\n`);
    console.log(`  ✓ deck: ${name} (${(data.slides || []).length} slides)`);
  }
}

// 4. bundle framework
mkdirSync(R('dist'), { recursive: true });
await build({
  entryPoints: [R('framework/index.js')],
  bundle: true, format: 'iife', target: 'es2020',
  outfile: R('dist/framework.js'), legalComments: 'none'
});
console.log('  ✓ dist/framework.js');

// 5. optional single-file offline export: `node build.mjs export`
const MIME = { woff2: 'font/woff2', woff: 'font/woff', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
const dataUri = (abs) => `data:${MIME[extname(abs).slice(1).toLowerCase()] || 'application/octet-stream'};base64,${readFileSync(abs).toString('base64')}`;
function inlineCss(file) {
  const dir = dirname(file);
  return readFileSync(file, 'utf8').replace(/url\((['"]?)([^'")]+)\1\)/g, (m, _q, url) => {
    if (/^(data:|https?:)/.test(url)) return m;
    const abs = resolve(dir, url);
    return existsSync(abs) ? `url("${dataUri(abs)}")` : m;
  });
}
function inlineAssets(node, deckDir) {
  if (Array.isArray(node)) return node.map((n) => inlineAssets(n, deckDir));
  if (node && typeof node === 'object') { const o = {}; for (const [k, v] of Object.entries(node)) o[k] = inlineAssets(v, deckDir); return o; }
  if (typeof node === 'string' && /\.(svg|png|jpe?g)$/i.test(node) && !/^(data:|https?:)/.test(node)) {
    const abs = resolve(deckDir, node); if (existsSync(abs)) return dataUri(abs);
  }
  return node;
}
if (process.argv.includes('export') && existsSync(decksDir)) {
  for (const name of readdirSync(decksDir)) {
    const deckDir = R('decks', name);
    if (!existsSync(join(deckDir, 'deck.yaml'))) continue;
    const data = inlineAssets(load(readFileSync(join(deckDir, 'deck.yaml'), 'utf8')), deckDir);
    const styles = ['framework/theme/fonts.css', 'vendor/reveal.css', 'framework/theme/tokens.css', 'framework/deck.css']
      .map((f) => `<style>${inlineCss(R(f))}</style>`).join('\n');
    const scripts = ['vendor/reveal.js', 'vendor/plugin/notes.js', 'vendor/plugin/highlight.js']
      .map((f) => `<script>${readFileSync(R(f), 'utf8')}</script>`).join('\n');
    const html = `<!DOCTYPE html><html lang="en" data-deck-theme="${data.theme || 'editorial'}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${data.title || 'Deck'}</title>
${styles}</head><body><div class="reveal"><div class="slides"></div></div>
${scripts}
<script>window.__DECK__ = ${JSON.stringify(data)};</script>
<script>${readFileSync(R('dist/framework.js'), 'utf8')}</script>
</body></html>`;
    writeFileSync(join(deckDir, `${name}.html`), html);
    console.log(`  ✓ single-file export: decks/${name}/${name}.html (${(html.length / 1024 | 0)} KB)`);
  }
}
console.log('DeckKit build complete.');

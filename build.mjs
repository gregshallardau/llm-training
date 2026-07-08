/* DeckKit build:
   1. vendor reveal.js dist (offline / Teams-safe)
   2. compile DTCG tokens → framework/theme/tokens.css (with AA validation)
   3. compile each decks/<name>/deck.yaml → deck-data.js (window.__DECK__, no fetch)
   4. bundle the framework (ES modules) → dist/framework.js (classic IIFE)
   Run: npm run build */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { load } from 'js-yaml';
import { build } from 'esbuild';
import { compileTokens } from './framework/theme/build-tokens.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const R = (...p) => join(root, ...p);

// 1. vendor reveal
mkdirSync(R('vendor/plugin'), { recursive: true });
copyFileSync(R('node_modules/reveal.js/dist/reveal.js'), R('vendor/reveal.js'));
copyFileSync(R('node_modules/reveal.js/dist/reveal.css'), R('vendor/reveal.css'));
copyFileSync(R('node_modules/reveal.js/dist/plugin/notes.js'), R('vendor/plugin/notes.js'));
console.log('  ✓ vendored reveal.js + notes plugin');

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
console.log('DeckKit build complete.');

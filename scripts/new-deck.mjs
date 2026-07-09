/* Scaffold a new deck: `npm run new -- <name>`
   Creates decks/<name>/ from decks/_template/ (deck.yaml + index.html). */
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];

if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('Usage: npm run new -- <deck-name>   (lowercase letters, digits, dashes)');
  process.exit(1);
}
const dir = join(root, 'decks', name);
if (existsSync(dir)) { console.error(`decks/${name} already exists.`); process.exit(1); }

mkdirSync(dir, { recursive: true });
copyFileSync(join(root, 'decks/_template/index.html'), join(dir, 'index.html'));
const yaml = readFileSync(join(root, 'decks/_template/deck.yaml'), 'utf8').replace('__TITLE__', name);
writeFileSync(join(dir, 'deck.yaml'), yaml);

console.log(`✓ Created decks/${name}/`);
console.log(`  Edit decks/${name}/deck.yaml, then:  npm run build  and open decks/${name}/`);

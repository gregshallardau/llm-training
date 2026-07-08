/* DeckKit build — vendors dependency dist files into vendor/ so the deck stays
   self-contained and offline (important: presented over Microsoft Teams, no CDN).
   Run: npm run build   (after npm install). */
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = join(root, 'vendor');

const DEPS = [
  ['node_modules/chart.js/dist/chart.umd.min.js', 'vendor/chart.umd.min.js'],
  ['node_modules/lucide/dist/umd/lucide.min.js', 'vendor/lucide.min.js'],
];

await mkdir(vendor, { recursive: true });
for (const [from, to] of DEPS) {
  await copyFile(join(root, from), join(root, to));
  console.log('vendored', to);
}
console.log('DeckKit build complete.');

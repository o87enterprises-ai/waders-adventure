// Sanity-checks src/game/hints.js against the game's word lists. Run: npm run check:hints
import fs from 'fs';
import { HINTS } from '../src/game/hints.js';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const quoted = (s) => [...s.matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
const whitelist = [...new Set(quoted(read('src/homework/parser.js').match(/new Set\(\[([\s\S]*?)\]\)/)[1]))];
const defaults = quoted(read('src/storage/wordBank.js').match(/DEFAULT_WORDS = \[([\s\S]*?)\]/)[1]);

const errors = [];
const fail = (msg) => errors.push(msg);

for (const w of [...whitelist, ...defaults]) if (!HINTS[w]) fail(`missing hint: ${w}`);

for (const [w, h] of Object.entries(HINTS)) {
  if (!Array.isArray(h) || h.length !== 3 || h.some((x) => typeof x !== 'string' || !x.trim())) {
    fail(`${w}: must be [emoji, description, sentence]`);
    continue;
  }
  const [, desc, sentence] = h;
  if (sentence.split('___').length !== 2) fail(`${w}: sentence needs exactly one "___"`);
  if (new RegExp(`\\b${w}\\b`, 'i').test(desc)) fail(`${w}: description gives away the word`);
  if (new RegExp(`\\b${w}\\b`, 'i').test(sentence)) fail(`${w}: sentence gives away the word`);
}

// Words that share consonants must not share a clue.
const frames = {};
for (const w of Object.keys(HINTS)) (frames[w[0] + '_' + w[2]] ||= []).push(w);
let ambiguous = 0;
for (const [frame, ws] of Object.entries(frames)) {
  if (ws.length < 2) continue;
  ambiguous++;
  for (const part of [1, 2]) {
    const seen = new Set(ws.map((w) => HINTS[w][part]));
    if (seen.size !== ws.length) fail(`${frame}: ${ws.join('/')} share a ${part === 1 ? 'description' : 'sentence'}`);
  }
}

console.log(`${Object.keys(HINTS).length} words, ${ambiguous} frames with several vowels`);
if (errors.length) {
  console.error(errors.map((e) => ' ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log('hints OK');

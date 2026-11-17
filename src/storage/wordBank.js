const KEY = 'waders_word_bank';
const DEFAULT_WORDS = [
  'cat', 'hat', 'bat', 'rat', 'sat',
  'dog', 'log', 'fog', 'hog',
  'sun', 'run', 'fun', 'bun',
  'pig', 'big', 'dig', 'wig',
  'bed', 'red', 'bug', 'rug', 'hug', 'top', 'hop', 'mop'
];
// Homework lists smaller than this are topped up with defaults so every level stays playable.
const MIN_WORDS = 8;

function stored() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function getWordBank() {
  const custom = stored();
  if (!custom.length) return [...DEFAULT_WORDS];
  if (custom.length >= MIN_WORDS) return custom;
  return [...new Set([...custom, ...DEFAULT_WORDS])];
}

export function customWordCount() {
  return stored().length;
}

export function setWordBank(words) {
  try { localStorage.setItem(KEY, JSON.stringify(words)); } catch { /* ignore */ }
}

export function clearWordBank() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function randomWord(exclude = []) {
  const all = getWordBank();
  const bank = all.filter((w) => !exclude.includes(w));
  const pool = bank.length ? bank : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

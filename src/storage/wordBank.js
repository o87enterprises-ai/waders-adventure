const KEY = 'waders_word_bank';
const DEFAULT_WORDS = ['cat', 'dog', 'sun', 'pig', 'bed', 'hat', 'bug', 'top', 'run', 'fun'];

export function getWordBank() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [...DEFAULT_WORDS];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length ? arr : [...DEFAULT_WORDS];
  } catch {
    return [...DEFAULT_WORDS];
  }
}

export function setWordBank(words) {
  localStorage.setItem(KEY, JSON.stringify(words));
}

export function randomWord(exclude = []) {
  const bank = getWordBank().filter((w) => !exclude.includes(w));
  const pool = bank.length ? bank : getWordBank();
  return pool[Math.floor(Math.random() * pool.length)];
}

// Curated whitelist of common CVC (consonant-vowel-consonant) words.
// Extend this list to broaden the game's vocabulary.
const CVC_WORDS = new Set([
  'bat','cat','hat','mat','rat','sat','fat','pat','vat',
  'bed','fed','led','red','wed',
  'big','dig','fig','pig','wig','rig','jig',
  'bob','cob','fob','gob','job','mob','rob','sob','log','dog','fog','hog','jog',
  'bug','dug','hug','jug','mug','pug','rug','tug',
  'bin','din','fin','pin','sin','tin','win',
  'bit','fit','hit','kit','lit','pit','sit','wit',
  'cap','gap','lap','map','nap','rap','sap','tap',
  'cub','dub','hub','nub','pub','rub','sub','tub',
  'dad','had','lad','mad','pad','sad',
  'den','hen','men','pen','ten',
  'dip','hip','lip','nip','pip','rip','sip','tip','zip',
  'dot','got','hot','jot','lot','not','pot','rot',
  'fan','man','pan','ran','tan','van',
  'get','jet','let','met','net','pet','set','vet','wet','yet',
  'gun','fun','nun','pun','run','sun',
  'jab','lab','nab','tab',
  'kid','lid','rid','bid',
  'low','row','tow','vow','wow','bow',
  'mix','fix','six','sit',
  'nod','pod','rod','sod',
  'top','cop','hop','mop','pop',
  'web','yam','ram','ham','jam'
]);

export function extractCVCWords(rawText) {
  const words = rawText
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const found = new Set();
  for (const w of words) if (CVC_WORDS.has(w)) found.add(w);

  // Fallback: pattern-match any strict CVC if whitelist misses
  if (found.size === 0) {
    const re = /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/;
    for (const w of words) if (re.test(w)) found.add(w);
  }
  return Array.from(found);
}

export function splitVowels(word) {
  const v = word.match(/[aeiou]/);
  if (!v) return null;
  return {
    consonantStart: word.slice(0, v.index),
    vowel: v[0],
    consonantEnd: word.slice(v.index + 1),
    word
  };
}

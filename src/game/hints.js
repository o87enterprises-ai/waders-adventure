// Hints for the spelling prompts: spoken word (Web Speech API) + a short picture clue.
// Words without a clue still get the spoken word, so every prompt is unambiguous.
const CLUES = {
  cat: '🐱 says meow', hat: '🎩 goes on your head', bat: '🦇 flies at night', rat: '🐀 a small rodent', sat: '🪑 past of sit', mat: '🧽 a floor mat', fat: '🐖 not thin', pat: '🐕 a gentle tap',
  dog: '🐶 says woof', log: '🪵 a piece of tree', fog: '🌫️ thick cloud on the ground', hog: '🐗 a big pig', jog: '🏃 slow run',
  sun: '☀️ shines in the sky', run: '🏃 go fast on foot', fun: '🎉 a good time', bun: '🍞 bread roll', gun: '🔫 a toy that shoots', nun: '⛪ lives in a convent', pun: '😄 a word joke',
  pig: '🐷 says oink', big: '🐘 not small', dig: '⛏️ make a hole', wig: '💇 fake hair', fig: '🍈 a sweet fruit', rig: '🛢️ an oil ___', jig: '💃 a lively dance',
  bed: '🛏️ you sleep in it', red: '🍎 the color of an apple', fed: '🍽️ gave food to', led: '🚶 showed the way', wed: '💍 get married',
  bug: '🐛 a tiny insect', rug: '🟫 a floor mat', hug: '🤗 squeeze with love', mug: '☕ a cup', jug: '🫗 holds juice or milk', dug: '⛏️ made a hole', pug: '🐶 a wrinkly dog', tug: '🪢 a hard pull',
  top: '🔝 the highest part', hop: '🐸 jump like a frog', mop: '🧹 cleans the floor', pop: '🎈 a loud bang', cop: '👮 police officer',
  bin: '🗑️ a trash can', fin: '🦈 on a fish', pin: '📌 sharp and small', tin: '🥫 a metal can', win: '🏆 come in first', din: '🔊 loud noise', sin: '🙅 doing wrong',
  bit: '🦷 a small piece', fit: '💪 healthy and strong', hit: '🥊 strike', kit: '🧰 a set of tools', lit: '🔥 on fire', pit: '🕳️ a deep hole', sit: '🪑 rest on a chair', wit: '😄 clever humor',
  cap: '🧢 a baseball hat', gap: '↔️ a space between', lap: '🧎 where you sit on', map: '🗺️ shows where to go', nap: '😴 a short sleep', rap: '🎤 a rhyming song', sap: '🌳 sticky tree juice', tap: '🚰 water comes out',
  cub: '🐻 a baby bear', hub: '🛞 center of a wheel', pub: '🍺 a place to eat', rub: '🧴 move your hand on', sub: '🥪 a long sandwich', tub: '🛁 a bathtub',
  dad: '👨 a father', had: '✅ past of have', lad: '👦 a boy', mad: '😠 very angry', pad: '📝 a notebook', sad: '😢 not happy',
  den: '🦊 an animal home', hen: '🐔 a mother chicken', men: '👨‍👨 more than one man', pen: '🖊️ you write with it', ten: '🔟 the number after nine',
  dip: '🥣 a quick swim', hip: '🦴 part of your body', lip: '👄 part of your mouth', nip: '🦀 a small bite', rip: '📄 tear apart', sip: '🥤 a small drink', tip: '💡 a helpful hint', zip: '🧥 close a jacket',
  dot: '⚫ a tiny round mark', got: '🎁 received', hot: '🔥 very warm', jot: '✏️ write quickly', lot: '🅿️ a parking ___', not: '🚫 the word no', pot: '🍲 you cook in it', rot: '🍎 go bad',
  fan: '🌀 spins to cool you', man: '👨 a grown boy', pan: '🍳 you fry in it', ran: '🏃 past of run', tan: '🏖️ a sandy color', van: '🚐 a big car',
  get: '🤲 to receive', jet: '✈️ a fast plane', let: '👍 allow', met: '🤝 saw for the first time', net: '🥅 catches fish or goals', pet: '🐕 a house animal', set: '🍽️ put in place', vet: '🩺 animal doctor', wet: '💦 not dry', yet: '⏳ up to now',
  nab: '🪤 to catch', jab: '👊 a quick punch', lab: '🧪 where science is done', tab: '📑 a small flap',
  kid: '🧒 a child', lid: '🥫 covers a jar', rid: '🧹 to get free of', bid: '🙋 an offer at an auction',
  low: '⬇️ not high', row: '🚣 paddle a boat', tow: '🚚 pull a car', vow: '💍 a serious promise', wow: '😮 what you say when amazed', bow: '🎀 a pretty ribbon',
  mix: '🥄 stir together', fix: '🔧 make it work again', six: '6️⃣ the number after five',
  nod: '🙂 move your head yes', pod: '🫛 holds peas', rod: '🎣 a fishing pole', sod: '🌱 a patch of grass',
  web: '🕸️ a spider makes it', yam: '🍠 a sweet root food', ram: '🐏 a male sheep', ham: '🍖 a pink meat', jam: '🍓 sweet fruit spread'
};

export function clueFor(word) {
  return CLUES[word] || '';
}

export function speak(word) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.7;
    u.pitch = 1.1;
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  } catch { /* speech not available */ }
}

// Hints for the vowel prompts. Many words share the same consonants (B_G = big / bug,
// T_P = tap / tip / top), so every word has:
//   - an emoji + a short DESCRIPTION that only fits that word, and
//   - a SENTENCE with a blank ("___") that only makes sense with that word.
// The word and the sentence are also spoken aloud (Web Speech API), so the child hears
// the middle sound in context. Keep entries in sync with CVC_WORDS in src/homework/parser.js
// (tools/check-hints.mjs fails if a word is missing or a hint is malformed).
const HINTS = {
  // -at / -et / -it / -ot / -ut families
  bat: ['🦇', 'a flying animal that sleeps upside down', 'The ___ flew out of the cave.'],
  cat: ['🐱', 'a furry pet that says meow', 'The ___ drank some milk.'],
  hat: ['🎩', 'you wear it on your head', 'He put on his ___ and went outside.'],
  mat: ['🧽', 'a small rug by the door for wiping your feet', 'Wipe your feet on the ___.'],
  rat: ['🐀', 'a small animal with a long tail', 'The ___ ran up the pipe.'],
  sat: ['🪑', 'what you did on a chair (past of sit)', 'She ___ down on the chair.'],
  fat: ['🐖', 'round and chubby, not skinny', 'The ___ pig rolled in the mud.'],
  pat: ['🐕', 'a gentle tap with your hand', 'Give the dog a soft ___.'],
  vat: ['🛢️', 'a very big tank that holds liquid', 'The cook stirred soup in the ___.'],
  bed: ['🛏️', 'where you sleep at night', 'Time to go to ___!'],
  fed: ['🍽️', 'gave food to (past of feed)', 'She ___ the fish this morning.'],
  led: ['🚶', 'showed the way (past of lead)', 'The guide ___ us up the hill.'],
  red: ['🍎', 'the color of a ripe apple', 'A fire truck is bright ___.'],
  wed: ['💍', 'got married', 'They ___ on a sunny day.'],

  // -ig / -og / -ug
  big: ['🐘', 'the opposite of small', 'An elephant is very ___.'],
  dig: ['⛏️', 'make a hole in the ground', 'Dogs love to ___ in the dirt.'],
  fig: ['🍈', 'a sweet, soft fruit with tiny seeds', 'I ate a ripe ___.'],
  pig: ['🐷', 'a pink farm animal that says oink', 'The ___ rolled in the mud.'],
  wig: ['💇', 'fake hair you can wear', 'The clown wore a funny ___.'],
  rig: ['🛢️', 'a big machine for drilling oil', 'The oil ___ stood in the sea.'],
  jig: ['💃', 'a lively, bouncy dance', 'They danced a happy ___.'],
  bob: ['🛟', 'to bounce up and down on water', 'The cork will ___ on the waves.'],
  cob: ['🌽', 'the middle part of an ear of corn', 'I ate corn on the ___.'],
  fob: ['🔑', 'a small tag on a key chain', 'The key ___ jingled in his pocket.'],
  gob: ['🎨', 'a big, messy lump of something', 'A ___ of paint fell on the floor.'],
  job: ['👷', 'the work a person does', 'A nurse has an important ___.'],
  mob: ['👥', 'a big, noisy crowd', 'A ___ of fans cheered loudly.'],
  rob: ['🏴‍☠️', 'to take what is not yours', 'Pirates would ___ the ship.'],
  sob: ['😭', 'to cry hard with big gulps', 'The baby began to ___.'],
  log: ['🪵', 'a thick piece of a tree trunk', 'We put a ___ on the fire.'],
  dog: ['🐶', 'a pet that barks and wags its tail', 'The ___ wagged its tail.'],
  fog: ['🌫️', 'thick cloud close to the ground', 'We could not see in the ___.'],
  hog: ['🐗', 'a very big pig', 'The ___ ate all the corn.'],
  jog: ['🏃', 'to run slowly for exercise', 'I ___ around the park.'],
  bug: ['🐛', 'a tiny insect that crawls', 'A ___ crawled on the leaf.'],
  dug: ['⛏️', 'made a hole (past of dig)', 'The puppy ___ a deep hole.'],
  hug: ['🤗', 'squeeze someone with love', 'Give Mom a big ___.'],
  jug: ['🫗', 'a big bottle for milk or juice', 'Pour the milk from the ___.'],
  mug: ['☕', 'a cup with a handle', 'She drank cocoa from a ___.'],
  pug: ['🐶', 'a small dog with a wrinkly face', 'The ___ snored on the couch.'],
  rug: ['🟫', 'a soft mat on the floor', 'The cat slept on the ___.'],
  tug: ['🪢', 'a hard pull', 'Give the rope a big ___.'],

  // -in / -it
  bin: ['🗑️', 'a container for trash', 'Put the paper in the ___.'],
  din: ['🔊', 'a very loud noise', 'The drums made a loud ___.'],
  fin: ['🦈', 'the part of a fish that helps it swim', "The shark's ___ cut through the water."],
  pin: ['📌', 'a small sharp tack', 'Stick the note up with a ___.'],
  sin: ['🙅', 'a wrong thing to do', 'Telling lies is a ___.'],
  tin: ['🥫', 'a metal can', 'The beans came in a ___.'],
  win: ['🏆', 'to come in first', 'Our team will ___ the game.'],
  bit: ['🦷', 'a small piece', 'I took a ___ of the apple.'],
  fit: ['💪', 'healthy and strong', 'Running keeps you ___.'],
  hit: ['🥊', 'to strike something', 'She will ___ the ball with the bat.'],
  kit: ['🧰', 'a set of tools or supplies', 'Dad opened the first-aid ___.'],
  lit: ['🔥', 'glowing with fire or light', 'The candle was ___.'],
  pit: ['🕳️', 'a deep hole', 'He fell into the ___.'],
  sit: ['🪑', 'rest on a chair', 'Please ___ down.'],
  wit: ['😄', 'being clever and funny', 'Her ___ made us laugh.'],

  // -ap / -ub / -ad
  cap: ['🧢', 'a baseball hat with a brim', 'He wore a ___ on the field.'],
  gap: ['↔️', 'an empty space between two things', 'Mind the ___ in the fence.'],
  lap: ['🧎', 'the flat part of your legs when you sit', 'The cat sat on my ___.'],
  map: ['🗺️', 'a drawing that shows where to go', 'We read the ___ to find the park.'],
  nap: ['😴', 'a short sleep', 'The baby took a ___.'],
  rap: ['🎤', 'a song with fast rhymes', 'He sang a ___ song.'],
  sap: ['🌳', 'the sticky juice inside a tree', 'Sticky ___ dripped from the tree.'],
  tap: ['🚰', 'water comes out of it', 'Turn off the ___.'],
  cub: ['🐻', 'a baby bear', 'The bear ___ played with its mom.'],
  dub: ['🎬', 'to give a movie a new voice', 'They will ___ the film in Spanish.'],
  hub: ['🛞', 'the center of a wheel', 'The spokes join at the ___.'],
  nub: ['✏️', 'a short stump left over', 'My pencil is just a ___.'],
  pub: ['🍽️', 'a place that serves food and drinks', 'We ate dinner at the ___.'],
  rub: ['🧴', 'to move your hand back and forth', 'Please ___ some lotion on my back.'],
  sub: ['🥪', 'a long sandwich', 'I had a turkey ___ for lunch.'],
  tub: ['🛁', 'a bathtub', 'The duck floated in the ___.'],
  dad: ['👨', 'a father', 'My ___ makes pancakes.'],
  had: ['✅', 'owned something (past of have)', 'She ___ a red balloon.'],
  lad: ['👦', 'a young boy', 'The ___ ran to school.'],
  mad: ['😠', 'very angry', 'He was ___ when he lost.'],
  pad: ['📝', 'sheets of paper stuck together', 'I wrote on my note ___.'],
  sad: ['😢', 'not happy', 'She felt ___ when it rained.'],

  // -en / -ip
  den: ['🦊', "a wild animal's home", 'The fox slept in its ___.'],
  hen: ['🐔', 'a mother chicken', 'The ___ laid an egg.'],
  men: ['👨‍👨', 'more than one man', 'Two ___ carried the box.'],
  pen: ['🖊️', 'you write with ink using this', 'Sign your name with a ___.'],
  ten: ['🔟', 'the number after nine', 'I have ___ fingers.'],
  dip: ['🥣', 'a quick swim, or to put food in a sauce', 'Take a ___ in the pool.'],
  hip: ['🦴', 'where your leg joins your body', 'She put her hand on her ___.'],
  lip: ['👄', 'a part of your mouth', 'I bit my ___.'],
  nip: ['🦀', 'a little pinch or bite', 'The crab gave a tiny ___.'],
  pip: ['🍎', 'a tiny seed inside a fruit', 'I spat out an apple ___.'],
  rip: ['📄', 'to tear apart', "Don't ___ the paper."],
  sip: ['🥤', 'a small drink', 'Take a little ___ of juice.'],
  tip: ['💡', 'a helpful hint', 'My coach gave me a ___.'],
  zip: ['🧥', 'to close a jacket', 'Please ___ up your coat.'],

  // -ot / -an / -et
  dot: ['⚫', 'a tiny round mark', 'Put a ___ at the end.'],
  got: ['🎁', 'received (past of get)', 'I ___ a gift today.'],
  hot: ['🔥', 'very warm', 'The soup is too ___.'],
  jot: ['✏️', 'to write down quickly', 'Let me ___ down your name.'],
  lot: ['🅿️', 'an open space for parking cars', 'We parked in the ___.'],
  not: ['🚫', 'the word that means no', 'I am ___ ready yet.'],
  pot: ['🍲', 'you cook soup in it', 'Stir the soup in the ___.'],
  rot: ['🍎', 'to go bad and spoil', 'Old fruit will ___.'],
  fan: ['🌀', 'spins to blow cool air', 'The ___ cooled the room.'],
  man: ['👨', 'a grown-up boy', 'The ___ walked his dog.'],
  pan: ['🍳', 'you fry eggs in it', 'Fry the egg in a ___.'],
  ran: ['🏃', 'went fast on foot (past of run)', 'The boy ___ home.'],
  tan: ['🏖️', 'a light brown color', 'The sand is ___.'],
  van: ['🚐', 'a big car for carrying things', 'The mail ___ stopped here.'],
  get: ['🤲', 'to receive', 'I will ___ a prize.'],
  jet: ['✈️', 'a very fast airplane', 'The ___ zoomed overhead.'],
  let: ['👍', 'to allow', 'Mom will ___ me play.'],
  met: ['🤝', 'saw someone for the first time', 'I ___ a new friend today.'],
  net: ['🥅', 'a mesh that catches fish or goals', 'The ball hit the ___.'],
  pet: ['🐕', 'an animal you keep at home', 'My ___ is a hamster.'],
  set: ['🍽️', 'to put in place', 'Please ___ the table.'],
  vet: ['🩺', 'a doctor for animals', 'The ___ checked my dog.'],
  wet: ['💦', 'not dry', 'The rain made me ___.'],
  yet: ['⏳', 'up to now', 'It is not time ___.'],

  // -un / -ab / -id / -ow / -ix / -od / -op / -am / -eb
  gun: ['💦', 'a toy that squirts water', 'We played with a squirt ___.'],
  fun: ['🎉', 'a good time', 'The party was ___.'],
  bun: ['🍞', 'a soft, round bread roll', 'I ate a ___ with my soup.'],
  nun: ['⛪', 'a woman who lives and prays in a convent', 'The ___ rang the church bell.'],
  pun: ['😄', 'a joke that plays with words', 'Dad told a silly ___.'],
  run: ['🏃', 'to move fast on foot', 'I can ___ very fast.'],
  sun: ['☀️', 'shines in the sky in the daytime', 'The ___ is bright today.'],
  jab: ['👊', 'a quick punch', 'The boxer threw a ___.'],
  lab: ['🧪', 'a room for science tests', 'We did tests in the science ___.'],
  nab: ['🪤', 'to catch quickly', 'The cat will ___ the mouse.'],
  tab: ['📑', 'a small flap or labeled card', 'Click the next ___.'],
  kid: ['🧒', 'a child', 'The ___ rode a bike.'],
  lid: ['🥫', 'the cover on a jar', 'Put the ___ on the jar.'],
  rid: ['🧹', 'to get free of something', 'We must get ___ of the trash.'],
  bid: ['🙋', 'an offer of money at an auction', 'He raised a ___ at the sale.'],
  low: ['⬇️', 'not high', 'The shelf is very ___.'],
  row: ['🚣', 'to paddle a boat', 'We ___ the boat across the lake.'],
  tow: ['🚚', 'to pull a car behind a truck', 'A truck will ___ the car.'],
  vow: ['💍', 'a serious promise', 'They made a ___ to be kind.'],
  wow: ['😮', 'what you say when you are amazed', '"___!" said Mia at the fireworks.'],
  bow: ['🎀', 'a pretty knot of ribbon', 'She tied a pink ___ on the gift.'],
  mix: ['🥄', 'to stir together', 'Please ___ the flour and the eggs.'],
  fix: ['🔧', 'to make it work again', 'Dad will ___ the bike.'],
  six: ['6️⃣', 'the number after five', 'I have ___ crayons.'],
  nod: ['🙂', 'move your head to say yes', 'She gave a ___ and smiled.'],
  pod: ['🫛', 'the case that holds peas', 'The peas are in the ___.'],
  rod: ['🎣', 'a long pole for fishing', 'Dad cast the fishing ___.'],
  sod: ['🌱', 'a patch of grass with soil', 'Roll out the ___ on the yard.'],
  top: ['🔝', 'the highest part', 'Climb to the ___ of the hill.'],
  cop: ['👮', 'a police officer', 'The ___ helped us cross the street.'],
  hop: ['🐸', 'to jump like a frog', 'The frog will ___ away.'],
  mop: ['🧹', 'cleans the floor with water', 'Use the ___ on the wet floor.'],
  pop: ['🎈', 'the loud bang of a balloon', 'The balloon went ___!'],
  web: ['🕸️', "a spider's sticky net", 'The spider spun a ___.'],
  yam: ['🍠', 'a sweet orange root food', 'We baked a ___.'],
  ram: ['🐏', 'a male sheep', 'The ___ has curly horns.'],
  ham: ['🍖', 'pink meat from a pig', 'I had a ___ sandwich.'],
  jam: ['🍓', 'sweet fruit spread', 'Spread ___ on the toast.'],
};

export { HINTS };

// "🐀 a small animal with a long tail" — the descriptive clue line.
export function clueFor(word) {
  const h = HINTS[word];
  return h ? `${h[0]} ${h[1]}` : '';
}

// "The ___ ran up the pipe." — the fill-in-the-blank line ('' for unknown words).
export function sentenceFor(word) {
  const h = HINTS[word];
  return h ? h[2] : '';
}

// Picture words that teach each short vowel sound.
export const VOWEL_KEYWORDS = { a: 'apple', e: 'egg', i: 'igloo', o: 'octopus', u: 'umbrella' };

// "BUG has U like UMBRELLA!" — shown when the wrong vowel is picked.
export function vowelReminder(word, vowel) {
  return `${word.toUpperCase()} has ${vowel.toUpperCase()} like ${VOWEL_KEYWORDS[vowel].toUpperCase()}!`;
}

// Says the word, then the sentence with the word filled in, so the vowel sound is heard in context.
export function speak(word, withSentence = true) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const say = (text, rate) => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = 1.1;
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    };
    say(word, 0.7);
    const s = sentenceFor(word);
    if (withSentence && s) say(s.replace('___', word), 0.85);
  } catch { /* speech not available */ }
}

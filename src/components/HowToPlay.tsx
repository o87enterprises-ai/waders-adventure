// "HOW TO PLAY" section for the landing page. Content mirrors the real game rules
// (src/game/campaign.js and src/game/scenes/*) — update both together.

function Key({ children }: { children: React.ReactNode }) {
  return <span className="key">{children}</span>;
}

const STEPS = [
  {
    n: 1,
    pow: 'BUMP!',
    title: 'Hit a ? block from below',
    body: (
      <>
        Jump up into a <strong>?</strong> block. A word appears with a vowel missing, like{' '}
        <span className="font-pixel text-[#3c1974]">C _ T</span>.
      </>
    ),
  },
  {
    n: 2,
    pow: 'LISTEN!',
    title: 'Hear it, then pick the vowel',
    body: (
      <>
        Wade says the word out loud and shows a picture clue. Tap <strong>🔊 HEAR IT</strong> to
        hear it again, then choose <Key>A</Key> <Key>E</Key> <Key>I</Key> <Key>O</Key>{' '}
        <Key>U</Key>.
      </>
    ),
  },
  {
    n: 3,
    pow: 'ZOOM!',
    title: 'Solve them all, run to the flag',
    body: (
      <>
        Solve every block and a flag pops up at the end of the street. Reach it to finish the
        level!
      </>
    ),
  },
];

const LEVEL_TYPES = [
  {
    pow: 'RUN!',
    name: 'Street levels',
    body: (
      <>
        Stomp the bots by landing on top of them. Dodge spikes, drones and pits. Wade has{' '}
        <strong>3 hearts</strong>. A wrong vowel never costs a heart, it just repeats the word.
      </>
    ),
  },
  {
    pow: 'SORT!',
    name: 'Sort It Out',
    body: (
      <>
        Words fall from the sky. <strong>Drag</strong> each one into the basket it rhymes with,
        like <span className="font-pixel text-yellow-300">-AT</span> or{' '}
        <span className="font-pixel text-yellow-300">-UG</span>. Sort enough words to win.
      </>
    ),
  },
  {
    pow: 'FIGHT!',
    name: 'Boss fights',
    body: (
      <>
        Every right vowel is a punch that hurts the villain. Every wrong one lets the villain hit
        Wade back. Win before Wade runs out of hearts!
      </>
    ),
  },
];

export default function HowToPlay() {
  return (
    <section id="how-to-play" className="grid-bg py-20 md:py-24 scroll-mt-4">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="comic-panel !bg-[#2c0d43]">
          <h2 className="comic-title">HOW TO PLAY</h2>
          <p className="text-center text-slate-200 text-lg mt-4 max-w-2xl mx-auto">
            Wade has <strong>8 levels</strong> to beat, ending with Doctor Doom. Here&apos;s how
            a street level works:
          </p>

          {/* Steps */}
          <ol className="grid md:grid-cols-3 gap-8 mt-12">
            {STEPS.map((s) => (
              <li key={s.n} className="feature-card relative !pt-10">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 grid h-10 w-10 place-items-center border-4 border-black bg-yellow-400 font-pixel text-xs text-black">
                  {s.n}
                </span>
                <div className="pow">{s.pow}</div>
                <h3 className="mt-3 font-pixel text-[0.75rem] leading-relaxed">{s.title}</h3>
                <p className="mt-3 text-base font-semibold text-slate-700">{s.body}</p>
              </li>
            ))}
          </ol>

          {/* Level types */}
          <h3 className="pixel-heading mt-16 text-center text-base md:text-2xl">
            THREE KINDS OF LEVELS
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {LEVEL_TYPES.map((t) => (
              <div key={t.name} className="border-[5px] border-black bg-[#3c1974] p-6 shadow-[6px_6px_0_#000]">
                <div className="font-pixel text-yellow-300 text-lg">{t.pow}</div>
                <h4 className="mt-3 font-pixel text-[0.75rem] leading-relaxed">{t.name}</h4>
                <p className="mt-3 text-slate-200">{t.body}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <h3 className="pixel-heading mt-16 text-center text-base md:text-2xl">CONTROLS</h3>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="border-[5px] border-black bg-white p-6 text-black shadow-[6px_6px_0_#000]">
              <h4 className="font-pixel text-[0.8rem]">⌨️ Keyboard</h4>
              <dl className="mt-4 space-y-3 font-semibold">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Move</dt>
                  <dd className="flex flex-wrap gap-1"><Key>←</Key> <Key>→</Key> or <Key>A</Key> <Key>D</Key></dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Jump</dt>
                  <dd className="flex flex-wrap gap-1"><Key>↑</Key> <Key>W</Key> <Key>Space</Key></dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Pick vowel</dt>
                  <dd className="flex flex-wrap gap-1"><Key>A</Key> <Key>E</Key> <Key>I</Key> <Key>O</Key> <Key>U</Key></dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Start</dt>
                  <dd className="flex flex-wrap gap-1"><Key>Enter</Key> or <Key>Space</Key></dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Back to menu</dt>
                  <dd className="flex flex-wrap gap-1"><Key>Esc</Key></dd>
                </div>
              </dl>
            </div>

            <div className="border-[5px] border-black bg-white p-6 text-black shadow-[6px_6px_0_#000]">
              <h4 className="font-pixel text-[0.8rem]">📱 Touch screen</h4>
              <dl className="mt-4 space-y-3 font-semibold">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Move</dt>
                  <dd className="flex flex-wrap gap-1"><Key>◀</Key> <Key>▶</Key> buttons, bottom left</dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Jump</dt>
                  <dd className="flex flex-wrap gap-1"><Key>▲</Key> button, bottom right</dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Pick vowel</dt>
                  <dd>Tap the big yellow letter</dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Sort words</dt>
                  <dd>Drag with your finger</dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="w-24 shrink-0">Start</dt>
                  <dd>Tap anywhere on the title screen</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Good to know */}
          <div className="mt-12 border-4 border-dashed border-yellow-300 p-6">
            <h3 className="font-pixel text-sm text-yellow-300">GOOD TO KNOW</h3>
            <ul className="mt-3 space-y-2 text-slate-200 list-disc pl-6">
              <li>
                <strong>Progress saves itself</strong> on this device. Press <strong>NEW GAME</strong>{' '}
                on the title screen to start over.
              </li>
              <li>
                <strong>Lost all your hearts?</strong> Tap to retry the same level. No harm done!
              </li>
              <li>
                <strong>📸 Scan homework</strong> in the game to swap in your own reading words.
              </li>
              <li>
                Turn the sound on! Wade reads every word aloud (on devices that support speech).
              </li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <a href="/play" className="comic-btn bg-red-600 inline-block">
              READY? PLAY NOW!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

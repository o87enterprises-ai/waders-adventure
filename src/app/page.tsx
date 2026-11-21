import Link from 'next/link';
import HowToPlay from '@/components/HowToPlay';

export default function WadersAdventurePage() {
  return (
    <main className="bg-[#12072e] text-white overflow-x-hidden">
      {/* HERO COVER */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-28">
        {/* Comic Burst Background */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-[#27105c] via-[#31127a] to-[#12072e]" />

          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle,#ffffff_2px,transparent_2px)] bg-[size:22px_22px]" />

          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/20"
                style={{
                  width: '2px',
                  height: '100%',
                  left: `${i * 5}%`,
                  transform: `rotate(${i % 2 ? 20 : -20}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Issue Badge */}
        <div className="absolute top-6 left-4 md:left-6 z-20">
          <div className="bg-red-600 border-4 border-black px-3 py-2 md:px-4 rotate-[-8deg] shadow-[6px_6px_0px_#000]">
            <span className="font-black text-base md:text-xl">ISSUE #1</span>
          </div>
        </div>

        {/* Collector Badge */}
        <div className="absolute top-6 right-4 md:right-6 z-20">
          <div className="bg-yellow-400 text-black border-4 border-black px-3 py-2 md:px-4 rotate-[8deg] shadow-[6px_6px_0px_#000] font-black text-xs md:text-base">
            COLLECTOR&apos;S EDITION
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* LOGO */}
          <h1 className="font-pixel text-5xl sm:text-6xl md:text-8xl text-yellow-300 drop-shadow-[6px_6px_0px_#1A237E] md:drop-shadow-[10px_10px_0px_#1A237E] tracking-wide">
            WADER&apos;S
          </h1>

          <h2 className="font-pixel text-2xl sm:text-3xl md:text-5xl text-white mt-4">
            ADVENTURE
          </h2>

          {/* Hero Character */}
          <div className="my-12 flex justify-center">
            <img
              src="/assets/wade.png"
              alt="Wade, the reading hero in his green cap"
              width={64}
              height={96}
              className="w-[220px] md:w-[300px] pixelated drop-shadow-[8px_8px_0px_#000]"
            />
          </div>

          {/* Speech Bubble */}
          <div className="inline-block bg-white text-black border-[6px] md:border-[8px] border-black rounded-3xl px-5 md:px-8 py-4 md:py-5 font-black text-lg md:text-2xl shadow-[8px_8px_0px_#000] md:shadow-[10px_10px_0px_#000]">
            LEARNING SAVES THE DAY!
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link href="/play" className="comic-btn bg-red-600">
              START READING
            </Link>

            <a href="#meet" className="comic-btn bg-blue-600">
              MEET WADER
            </a>
          </div>
        </div>
      </section>

      {/* PANEL 1 */}
      <section id="meet" className="bg-[#251052] border-y-[12px] border-black py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="comic-panel">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <img
                src="/assets/bg-menu.png"
                alt="A pixel-art city skyline at sunset with floating letters"
                width={960}
                height={540}
                className="w-full rounded-xl border-8 border-black pixelated"
              />

              <div>
                <div className="speech-bubble">I&apos;m Wader! Let&apos;s Read!</div>

                <h2 className="text-3xl md:text-5xl font-black mt-8">
                  EVERY HERO
                  <br />
                  STARTS
                  <br />
                  SOMEWHERE.
                </h2>

                <p className="mt-6 text-lg text-slate-200">
                  Travel through comic-inspired adventures, unlock reading powers, defeat
                  vocabulary villains, and become the ultimate Reading Hero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL 2 */}
      <section className="bg-[#130726] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="comic-panel bg-[#2c0d43]">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="bg-red-600 border-4 border-black p-3 inline-block rotate-[-2deg] font-black">
                  VILLAIN OF THE WEEK
                </div>

                <h2 className="text-3xl md:text-5xl font-black mt-6">
                  THE WORD
                  <br />
                  DESTROYER
                </h2>

                <div className="speech-bubble mt-8">YOU&apos;LL NEVER READ THIS WORD!</div>
              </div>

              <div className="flex justify-center">
                <img
                  src="/assets/doom.png"
                  alt="The Word Destroyer, a green-armored villain"
                  width={64}
                  height={96}
                  className="w-[200px] md:w-[280px] pixelated drop-shadow-[8px_8px_0px_#000]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POWER UP */}
      <section id="power-up" className="py-24 bg-[#251052]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="comic-panel">
            <h2 className="comic-title">POWER UP YOUR READING!</h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="feature-card">
                <div className="pow">KA-POW!</div>
                <h3 className="mt-2 text-xl font-black">Vocabulary Boost</h3>
              </div>

              <div className="feature-card">
                <div className="pow">BOOM!</div>
                <h3 className="mt-2 text-xl font-black">Reading Speed</h3>
              </div>

              <div className="feature-card">
                <div className="pow">ZAP!</div>
                <h3 className="mt-2 text-xl font-black">Comprehension Power</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY */}
      <HowToPlay />

      {/* ACTION MENU */}
      <section className="py-24 bg-[#16092c]">
        <div className="text-center px-6">
          <h2 className="comic-title mb-12">CHOOSE YOUR MISSION</h2>

          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/play" className="action-btn bg-red-600">
              PLAY
            </Link>

            <a href="#how-to-play" className="action-btn bg-blue-600">
              HOW TO PLAY
            </a>

            <span
              aria-disabled="true"
              title="Coming soon"
              className="action-btn bg-yellow-400 text-black opacity-70 cursor-not-allowed"
            >
              LEADERBOARD
              <span className="block mt-1 text-sm">COMING SOON</span>
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link
            href="/play"
            className="inline-block bg-pink-500 border-8 border-white rounded-3xl px-8 md:px-12 py-5 md:py-6 text-2xl md:text-3xl font-black shadow-[10px_10px_0px_#421842]"
          >
            📸 SCAN HOMEWORK
          </Link>

          <p className="mt-10 text-gray-400">Created with ❤️ for Wade</p>

          <p className="text-sm text-gray-500 mt-2">Wader&apos;s Adventure • Issue #1</p>
        </div>
      </footer>
    </main>
  );
}

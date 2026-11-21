import Link from 'next/link';
import CoverHero from '@/components/CoverHero';
import HowToPlay from '@/components/HowToPlay';

export default function WadersAdventurePage() {
  return (
    <main className="bg-[#12072e] text-white overflow-x-hidden">
      {/* HERO COVER */}
      <CoverHero />

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

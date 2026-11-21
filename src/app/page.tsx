import Link from 'next/link';
import CoverHero from '@/components/CoverHero';
import HowToPlay from '@/components/HowToPlay';

export default function WadersAdventurePage() {
  return (
    <main className="bg-[#12072e] text-white overflow-x-hidden">
      {/* HERO COVER */}
      <CoverHero />
      <div className="stripe-band" aria-hidden="true" />

      {/* MEET WADER */}
      <section id="meet" className="grid-bg-alt py-20 md:py-24 scroll-mt-4">
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="comic-panel">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <img
                src="/assets/bg-menu.png"
                alt="A pixel-art city skyline at sunset with floating letters"
                width={960}
                height={540}
                className="w-full pixel-frame pixelated"
              />

              <div>
                <div className="speech-bubble">I&apos;m Wader! Let&apos;s Read!</div>

                <h2 className="pixel-heading text-xl md:text-3xl mt-8">
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

      {/* VILLAIN */}
      <section className="grid-bg py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="comic-panel !bg-[#2c0d43]">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="ribbon">VILLAIN OF THE WEEK</div>

                <h2 className="pixel-heading text-xl md:text-3xl mt-8">
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
      <section id="power-up" className="grid-bg-alt py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="comic-panel">
            <h2 className="comic-title">POWER UP YOUR READING!</h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="feature-card">
                <div className="pow">KA-POW!</div>
                <h3 className="mt-3 font-pixel text-[0.75rem] leading-relaxed">Vocabulary Boost</h3>
              </div>

              <div className="feature-card">
                <div className="pow">BOOM!</div>
                <h3 className="mt-3 font-pixel text-[0.75rem] leading-relaxed">Reading Speed</h3>
              </div>

              <div className="feature-card">
                <div className="pow">ZAP!</div>
                <h3 className="mt-3 font-pixel text-[0.75rem] leading-relaxed">Comprehension Power</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY */}
      <HowToPlay />

      {/* ACTION MENU */}
      <section className="grid-bg-alt py-20 md:py-24">
        <div className="text-center px-5">
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
              <span className="block mt-2 text-[0.6rem]">COMING SOON</span>
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="stripe-band" aria-hidden="true" />
      <footer className="bg-black py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-6 text-center">
          <Link href="/play" className="comic-btn bg-pink-500 !text-sm md:!text-base">
            📸 SCAN HOMEWORK
          </Link>

          <p className="mt-10 font-pixel text-[0.7rem] leading-loose text-gray-300">Created with ❤️ for Wade</p>

          <p className="mt-2 font-pixel text-[0.6rem] leading-loose text-gray-500">
            Wader&apos;s Adventure • Issue #1
          </p>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';

// Hero styled like a classic 8-bit game box: tall portrait cover, big outlined logo,
// painted key art, dark footer strip and a gold seal. All artwork is original / from the game;
// no third-party logos or marks. Sizes use container units (cqw) so the box scales as one piece.

function Logo({ text, size, from, via, to }: { text: string; size: number; from: string; via: string; to: string }) {
  const stroke = `${size * 0.1}cqw`;
  const common = 'absolute inset-0 select-none text-black';
  return (
    <span className="relative inline-block leading-none" style={{ fontSize: `${size}cqw` }}>
      <span aria-hidden className={common} style={{ WebkitTextStroke: `${stroke} #000`, transform: `translate(${size * 0.07}cqw, ${size * 0.1}cqw)` }}>{text}</span>
      <span aria-hidden className={common} style={{ WebkitTextStroke: `${stroke} #000` }}>{text}</span>
      <span
        className="relative bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(to bottom, ${from} 0%, ${via} 55%, ${to} 100%)` }}
      >
        {text}
      </span>
    </span>
  );
}

function Seal() {
  return (
    <div
      aria-hidden
      className="grid place-items-center rounded-full border-black text-center font-black text-[#5a3a00] shadow-[0.8cqw_0.8cqw_0_#000]"
      style={{
        width: '19cqw',
        height: '19cqw',
        borderWidth: '0.8cqw',
        background: 'radial-gradient(circle at 35% 30%, #fff6b0 0%, #ffd23f 38%, #d99a00 100%)',
        fontSize: '2.1cqw',
        lineHeight: 1.15,
      }}
    >
      <span>
        <span style={{ fontSize: '4.6cqw' }}>★</span>
        <br />
        READING
        <br />
        HERO
        <br />
        SEAL
      </span>
    </div>
  );
}

export default function CoverHero() {
  return (
    <section className="relative overflow-hidden bg-[#12072e] py-10 md:py-16">
      {/* subtle pixel grid backdrop */}
      <div aria-hidden className="absolute inset-0 opacity-20 bg-[linear-gradient(#ffffff22_1px,transparent_1px),linear-gradient(90deg,#ffffff22_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:justify-center md:gap-16 md:px-6">
        {/* ============ THE BOX ============ */}
        <h1 className="m-0 font-normal">
          <span className="sr-only">Wader&apos;s Adventure</span>
          <div
            aria-hidden
            className="relative aspect-[9/16] overflow-hidden border-black bg-black font-pixel shadow-[14px_14px_0_#000]"
            style={{ width: 'min(86vw, 47vh)', minWidth: 260, borderWidth: 6, containerType: 'inline-size' }}
          >
            {/* painted backdrop: night city + sunburst */}
            <img src="/assets/bg-menu.png" alt="" className="pixelated absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '64% 50%' }} />
            <div
              className="absolute inset-0"
              style={{ background: 'repeating-conic-gradient(from 0deg at 50% 66%, rgba(255,225,70,.5) 0 7deg, rgba(255,140,0,0) 7deg 14deg)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(18,7,46,.95) 0%, rgba(18,7,46,.9) 20%, rgba(18,7,46,0) 38%, rgba(18,7,46,0) 70%, rgba(0,0,0,.65) 100%)' }} />

            {/* top label */}
            <div className="absolute left-[4cqw] top-[3cqw] flex w-[92cqw] items-center justify-between text-white" style={{ fontSize: '2.6cqw' }}>
              <span className="bg-red-600 px-[2cqw] py-[1cqw] outline outline-[0.5cqw] outline-black">READING QUEST</span>
              <span>1 PLAYER</span>
            </div>

            {/* logo */}
            <div className="absolute left-0 top-[9cqw] flex w-full flex-col items-center">
              <Logo text="WADER'S" size={13} from="#ffffff" via="#ffe45c" to="#ff8a00" />
              <div className="mt-[3cqw] -rotate-2 bg-[#d71f2b] px-[3cqw] py-[1.6cqw] outline outline-[0.8cqw] outline-black shadow-[1cqw_1cqw_0_#000]">
                <Logo text="ADVENTURE" size={8.2} from="#ffffff" via="#dff3ff" to="#6fb5ff" />
              </div>
            </div>

            {/* characters */}
            <img src="/assets/spidey-cameo.png" alt="" className="pixelated absolute left-1/2 top-[34cqw] -translate-x-1/2 drop-shadow-[0.8cqw_0.8cqw_0_rgba(0,0,0,.6)]" style={{ width: '36cqw' }} />
            <img src="/assets/doom.png" alt="" className="pixelated absolute bottom-[31cqw] right-[2cqw] -scale-x-100 drop-shadow-[1cqw_1cqw_0_rgba(0,0,0,.6)]" style={{ width: '46cqw' }} />
            <img src="/assets/wade.png" alt="" className="pixelated absolute bottom-[29cqw] left-[4cqw] drop-shadow-[1cqw_1cqw_0_rgba(0,0,0,.6)]" style={{ width: '50cqw' }} />

            {/* footer strip */}
            <div className="absolute inset-x-0 bottom-0 h-[24cqw] bg-black" />
            <div className="absolute bottom-[12cqw] left-[4cqw]">
              <div className="rotate-[-1.5deg] bg-[#ffd23f] px-[3cqw] py-[1.5cqw] text-black outline outline-[0.7cqw] outline-black shadow-[0.9cqw_0.9cqw_0_#000]" style={{ fontSize: '2.6cqw' }}>
                LEARNING SAVES THE DAY!
              </div>
            </div>
            <div className="absolute bottom-[3cqw] left-[4cqw] text-white/80" style={{ fontSize: '2.4cqw', lineHeight: 1.7 }}>
              LEARN TO READ<br />ONE VOWEL AT A TIME
            </div>
            <div className="absolute bottom-[2cqw] right-[3cqw]">
              <Seal />
            </div>
          </div>
        </h1>

        {/* ============ CALL TO ACTION ============ */}
        <div className="max-w-md text-center md:text-left">
          <div className="inline-block rounded-3xl border-[6px] border-black bg-white px-5 py-4 text-lg font-black text-black shadow-[8px_8px_0_#000] md:text-2xl">
            LEARNING SAVES THE DAY!
          </div>
          <p className="mt-6 text-lg text-slate-200">
            Help Wade read his way across the city. Bump <strong>?</strong> blocks, pick the missing
            vowel, stomp the bots and take down Doctor Doom!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
            <Link href="/play" className="comic-btn bg-red-600">
              START READING
            </Link>
            <a href="#meet" className="comic-btn bg-blue-600">
              MEET WADER
            </a>
          </div>
          <p className="mt-8 font-pixel text-sm text-yellow-300 motion-safe:animate-pulse">PRESS START</p>
        </div>
      </div>
    </section>
  );
}

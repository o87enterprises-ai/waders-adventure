'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Status = { text: string } | null;

export default function GameClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>(null);

  // Boot Phaser on the client only, and tear it down on unmount (also covers React strict-mode remounts).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { createGame } = await import('@/game/start.js');
      if (cancelled || !containerRef.current) return;
      gameRef.current = createGame(containerRef.current);
    })();
    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const flash = (text: string, ms: number) => {
    setStatus({ text });
    setTimeout(() => setStatus(null), ms);
  };

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // allow re-uploading the same file

    setStatus({ text: 'Reading homework… 0%' });
    try {
      // OCR + word bank are only needed after a scan, so load them lazily.
      const [{ handleHomeworkScan }, { setWordBank }] = await Promise.all([
        import('@/homework/ocr.js'),
        import('@/storage/wordBank.js'),
      ]);
      const words: string[] = await handleHomeworkScan(file, (pct: number) =>
        setStatus({ text: `Reading homework… ${Math.round(pct * 100)}%` })
      );
      if (words.length === 0) {
        flash('No reading words found. Try a clearer photo!', 3000);
        return;
      }
      setWordBank(words);
      // Bonus feature: just swaps the word list. Never interrupts the current level;
      // new words appear from the next block / word / round on.
      flash(`Found ${words.length} words! They're in the game now.`, 2500);
      const menu = gameRef.current?.scene.getScene('MenuScene');
      if (menu && menu.scene.isActive()) menu.refreshWords();
    } catch (err) {
      console.error(err);
      flash('Scan failed. Please try again.', 3000);
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-pixel">
      <div ref={containerRef} className="h-full w-full [&_canvas]:mx-auto [&_canvas]:block" />

      <Link
        href="/"
        className="fixed left-3 bottom-3 z-[100] rounded-md border-2 border-white bg-black/70 px-3 py-2 text-[10px] text-white"
      >
        ← HOME
      </Link>

      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="pointer-events-auto cursor-pointer rounded-lg border-[3px] border-white bg-[#ff2d55] px-4 py-3 text-[11px] text-white shadow-[0_4px_0_#99001f] active:translate-y-0.5 active:shadow-[0_2px_0_#99001f]"
        >
          📸 SCAN HOMEWORK
        </button>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
        {status && (
          <div className="pointer-events-auto max-w-[300px] rounded-md border-2 border-[#00ffcc] bg-black/90 px-3.5 py-2.5 text-[10px] leading-[1.6] text-[#00ffcc]">
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
}

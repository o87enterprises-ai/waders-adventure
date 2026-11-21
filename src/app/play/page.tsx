import type { Metadata } from 'next';
import GameClient from '@/components/GameClient';

export const metadata: Metadata = { title: "Play — Wader's Adventure" };

export default function PlayPage() {
  return <GameClient />;
}

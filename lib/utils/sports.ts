import type { Event, Market } from "@/lib/types/polymarket";
import { getYesPrice } from "./market";

interface MatchupOdds {
  teamA: string;
  teamB: string;
  teamAPrice: number;
  teamBPrice: number;
  drawPrice?: number;
  gameTime?: string;
}

export function parseMatchupEvent(event: Event): MatchupOdds | null {
  const match = event.title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (!match) return null;

  const teamA = match[1].trim();
  const teamB = match[2].trim();
  const markets = event.markets.filter((m) => m.active && !m.closed);

  let teamAPrice = 0;
  let teamBPrice = 0;
  let drawPrice: number | undefined;
  let gameTime: string | undefined;

  for (const m of markets) {
    const gt = m.groupItemTitle || "";
    const price = getYesPrice(m);
    const gameStart = (m as Market & { gameStartTime?: string }).gameStartTime;
    if (gameStart) gameTime = gameStart;

    if (gt.toLowerCase().includes("draw")) {
      drawPrice = price;
    } else if (gt === teamA) {
      teamAPrice = price;
    } else if (gt === teamB) {
      teamBPrice = price;
    }
  }

  if (!teamAPrice && !teamBPrice) return null;

  return { teamA, teamB, teamAPrice, teamBPrice, drawPrice, gameTime };
}

export function isSportsMatchup(event: Event): boolean {
  return parseMatchupEvent(event) !== null;
}

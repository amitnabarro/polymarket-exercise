import { atom } from "jotai";
import { getLeaderboard } from "@/lib/api/gamma";

export const leaderboardAtom = atom(async () => getLeaderboard(25));

import { PlayerOption } from "./PlayerOption";

export type CardTimelineEvent = {
  id: string;
  minute: number;
  side: TeamSide;
  player: PlayerOption;
  cardType: "YELLOW" | "RED";
  note?: string;
};

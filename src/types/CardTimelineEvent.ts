import { PlayerOption } from "./PlayerOption";

export type CardTimelineEvent = {
  minute: number;
  side: TeamSide;
  player: PlayerOption;
  cardType: "YELLOW" | "RED";
};

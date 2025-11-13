import { PlayerOption } from "./PlayerOption";

export type PenaltyStopTimelineEvent = {
  minute: number;
  side: TeamSide;
  goalkeeper: PlayerOption;
};


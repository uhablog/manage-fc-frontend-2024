import { PlayerOption } from "./PlayerOption";

export type PenaltyStopTimelineEvent = {
  id: string;
  minute: number;
  side: TeamSide;
  goalkeeper: PlayerOption;
};


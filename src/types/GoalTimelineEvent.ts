import { PlayerOption } from "./PlayerOption";

export type GoalTimelineEvent = {
  id: string;
  minute: number;
  side: TeamSide;
  scorer: PlayerOption;
  assist?: PlayerOption | null;
};

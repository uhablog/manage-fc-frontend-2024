import { PlayerOption } from "./PlayerOption";

export type GoalTimelineEvent = {
  minute: number;
  side: TeamSide;
  scorer: PlayerOption;
  assist?: PlayerOption | null;
  penalty?: boolean;
};

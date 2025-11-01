import { PlayerOption } from "./PlayerOption";

export type ResultFormState = {
  homeScore: string;
  awayScore: string;
  momSide: TeamSide;
  momPlayer: PlayerOption | null;
  note: string;
  confirmed: boolean;
};

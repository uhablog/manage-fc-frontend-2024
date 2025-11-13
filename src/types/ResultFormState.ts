import { PlayerOption } from "./PlayerOption";

export type ResultFormState = {
  momSide: TeamSide;
  momPlayer: PlayerOption | null;
  momRating: number | null;
  confirmed: boolean;
};

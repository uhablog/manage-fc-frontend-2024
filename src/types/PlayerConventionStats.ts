export type PlayerConventionStats = {
  convention_id: string;
  convention_name: string;
  player_id: string;
  player_name: string;
  footballapi_player_id: number;
  birth_date: string;
  nationality: string;
  height: string;
  weight: string;
  goals: string;
  assists: string;
};

export type PlayerProfileData = {
  player_name: string;
  footballapi_player_id: number;
  birth_date: string;
  nationality: string;
  height: string;
  weight: string;
  stats: PlayerConventionStats[];
};

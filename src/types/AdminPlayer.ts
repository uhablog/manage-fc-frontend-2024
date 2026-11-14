export type AdminMember = {
  id: string;
  org_id: string;
  auth0_user_id: string;
  nickname: string;
  role: 'admin' | 'member';
};

export type AdminPlayer = {
  id: string;
  footballapi_player_id: number;
  footballapi_team_id: number;
  player_name: string;
  birth_date: string | null;
  nationality: string | null;
  height: string | null;
  weight: string | null;
  position: string;
  owner_member_id: string | null;
  owner_auth0_user_id: string | null;
  owner_nickname: string | null;
};

export type OwnershipHistory = {
  id: string;
  previous_owner_nickname: string | null;
  new_owner_nickname: string | null;
  changed_by_nickname: string;
  action: 'import' | 'assign' | 'reassign' | 'unassign';
  changed_date: string;
};

export type ApiFootballPlayer = {
  id: number;
  name: string;
  nationality?: string | null;
  photo?: string;
  registered: boolean;
};

export type ApiFootballTeam = {
  id: number;
  name: string;
  logo?: string;
};

export type ApiFootballPlayerTeam = {
  team: ApiFootballTeam;
  position: string | null;
};

export type ApiFootballSquadPlayer = {
  footballapi_player_id: number;
  footballapi_team_id: number;
  player_name: string;
  nationality: string | null;
  position: string;
  registered: boolean;
};

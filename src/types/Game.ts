export type Game = {
  game_id: string
  home_team_name: string
  home_team_score: number
  home_team_scorer: Scorers[]
  home_team_assists: Assists[]
  away_team_name: string
  away_team_score: number
  away_team_scorer: Scorers[]
  away_team_assists: Assists[]
  created_date: string
  mom: string
  mom_footballapi_player_id: string
  mom_team_id: string
  home_team_id: string
  away_team_id: string
}

type Scorers = {
  name: string
  footballapi_player_id: number
}

type Assists = {
  name: string
  footballapi_player_id: number
}
export type Game = {
  game_id: string
  home_team_name: string
  home_team_score: number
  home_team_scorer: Scorers[]
  home_team_assists: Assists[]
  home_team_yellow_cards: Cards[]
  home_team_red_cards: Cards[]
  home_team_penalty_stops: PenaltyStop[]
  away_team_name: string
  away_team_score: number
  away_team_scorer: Scorers[]
  away_team_assists: Assists[]
  away_team_yellow_cards: Cards[]
  away_team_red_cards: Cards[]
  away_team_penalty_stops: PenaltyStop[]
  created_date: string
  mom: string
  mom_footballapi_player_id: string
  mom_team_id: string
  home_team_id: string
  away_team_id: string
  home_team_auth0_user_id: string
  away_team_auth0_user_id: string
  home_team_emblem_url?: string | null
  away_team_emblem_url?: string | null
  confirmed: boolean
  mom_rating: number
}

type Scorers = {
  name: string
  footballapi_player_id: number
  minuts: number
  penalty: boolean
}

type Assists = {
  name: string
  footballapi_player_id: number
}

type Cards = {
  name: string
  footballapi_player_id: number
  minuts: number
}

type PenaltyStop = {
  name: string
  footballapi_player_id: number
  minute?: number
  minuts?: number
}

export type Team = {
  id: string
  convention_id: string
  team_name: string
  manager_name: string
  games: number
  win: number
  draw: number
  lose: number
  totalScore: number
  concededPoints: number
  created_date: string
  created_user: string
  updated_date: string
  updated_user: string
  auth0_user_id: string
  emblem_url?: string | null
}

export type Auth0User = {
  user_id: string
  name: string
  nickname: string
  picuture: string
  email: string
  email_verified: string
  identities: Identity[]
  last_ip: string
  last_login: string
  logins_count: number
  created_at: string
  updated_at: string
}

type Identity = {
  connection: string
  isSocial: boolean
  provider: string
  user_id: string
}
'use client'
import GameDetail from "@/app/component/GameDetail";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function DetailGamePage(
  { params }: {
    params: {
      id: string
      game_id: string
    }
  }
) {
  return (
    <GameDetail id={params.id} game_id={params.game_id} />
  )
});
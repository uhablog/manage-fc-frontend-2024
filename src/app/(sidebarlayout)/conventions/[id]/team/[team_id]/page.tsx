'use client'

import DisplayTeamDetail from "@/app/component/DisplayTeamDetail";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function Team(
  { params }: {
    params: {
      id: string
      team_id: string
    }
  }
) {
  return (
    <>
      <DisplayTeamDetail convention_id={params.id} team_id={params.team_id} />
    </>
  )
});
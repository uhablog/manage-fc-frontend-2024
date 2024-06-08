'use client'

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"

export default withPageAuthRequired(function RankingPage({
  params
}: {
  params: {
    id: string
  }
}) {
  return (
    <></>
  )
});
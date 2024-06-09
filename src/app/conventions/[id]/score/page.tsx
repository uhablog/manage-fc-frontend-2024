'use client'

import DisplayScorer from "@/app/component/DisplayScorer";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ScorerPage({ params }: {params: {id: string}}) {
  return (
    <>
      <DisplayScorer />
    </>
  )
});
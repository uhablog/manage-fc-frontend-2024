'use client'

import DisplayTeams from "@/app/component/DisplayTeams";
import { Team } from "@/types/Team";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { useEffect, useState } from "react";

export default withPageAuthRequired(function RankingPage({
  params
}: {
  params: {
    id: string
  }
}) {

  const id = params.id;
  const [teams, setTeams] = useState<Team[]>([]);

  // チーム一覧の取得
  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch(`/api/teams/${id}`);
      const json = await res.json();
      setTeams(json.data);
    }

    fetchTeams();
  }, [id]);

  return (
    <>
      <DisplayTeams teams={teams} />
    </>
  )
});
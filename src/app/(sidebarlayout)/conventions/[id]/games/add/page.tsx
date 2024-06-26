'use client'
import GameAdd from "@/app/component/GameAdd";
import { Team } from "@/types/Team";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default withPageAuthRequired(function GameAddPage({
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
      const res = await fetch(`/api/convention/${id}/teams`);
      const json = await res.json();
      setTeams(json.data);
    }

    fetchTeams();
  }, [id]);
  return (
    <>
      <GameAdd convention_id={id} teams={teams} />
    </>
  )
}); 
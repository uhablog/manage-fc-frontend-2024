'use client'
import GameAddV2 from "@/app/component/GameAddV2";
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
      <GameAddV2 convention_id={id} teams={teams} />
    </>
  )
}); 
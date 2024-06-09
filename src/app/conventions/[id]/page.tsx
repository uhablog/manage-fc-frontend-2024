'use client'
import DisplayGames from "@/app/component/DisplayGames";
import { Game } from "@/types/Game";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default withPageAuthRequired(function GamePage({ params }: {params: {id: string}}) {

  const id = params.id;

  const [games, setGames] = useState<Game[]>([]);

  // 試合一覧の取得
  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(`/api/games/${id}`);
      const json = await res.json()
      setGames(json.data);
    }
    fetchGames();
  }, [id]);

  return (
    <>
      <DisplayGames convention_id={id} games={games} />
    </>
  )
});
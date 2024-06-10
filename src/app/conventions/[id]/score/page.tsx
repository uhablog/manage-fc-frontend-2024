'use client'

import DisplayScorer from "@/app/component/DisplayScorer";
import { Scorer } from "@/types/Scorer";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default withPageAuthRequired(function ScorerPage({
   params 
}: {
  params: {
    id: string
  }
}) {

  const id = params.id;
  const [scorers, setScorers] = useState<Scorer[]>([]);

  // 得点者の取得
  useEffect(() => {
    const fetchScorer = async () => {
      const res = await fetch(`/api/convention/${id}/score`);
      const json = await res.json();
      setScorers(json.data);
    }

    fetchScorer();
  }, [id]);

  return (
    <>
      <DisplayScorer scorers={scorers} />
    </>
  )
});
'use client';

import BestElevenAdd from "@/app/component/BestElevenAdd";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function BestElevenPage({
  params
}: {
  params: {
    id: string
  }
}) {
  const id = params.id;

  return (
    <>
      <BestElevenAdd convention_id={id} />
    </>
  )
});
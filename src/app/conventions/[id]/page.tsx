'use client'
import ConventionPage from "@/app/component/ConventionPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function GamePage({ params }: {params: {id: string}}) {


  return (
    <>
      <ConventionPage id={params.id}/>
    </>
  )
});
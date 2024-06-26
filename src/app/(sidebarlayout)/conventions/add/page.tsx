'use client'
import ConventionAdd from "@/app/component/ConventionAdd";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ConventionAddPage(){
  return (
    <>
      <ConventionAdd/>
    </>
  )
});
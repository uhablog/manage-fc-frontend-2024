'use client';
import DisplayUserInfo from "../component/DisplayUserInfo";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ConventionPage() {

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    user && (
      <>
        <DisplayUserInfo user={user} />
      </>
    )
  )
});
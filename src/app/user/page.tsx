import { Session, getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import DisplayUserInfo from "../component/DisplayUserInfo";

export default withPageAuthRequired(async function ConventionPage() {
  const session: Session | null | undefined = await getSession();
  const user = session?.user;

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <>
      <DisplayUserInfo user={user} />
    </>
  )
}, { returnTo: '/user'});
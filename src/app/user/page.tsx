import { Session, getAccessToken, getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default withPageAuthRequired(async function ConventionPage() {
  const session: Session | null | undefined = await getSession();
  const user = session?.user;

  if (!user) {
    return <p>Loading...</p>
  }

  const access_token = (await getAccessToken()).accessToken;

  return (
    <>
      <Image
        src={user.picture}
        alt={user.name}
        width={200}
        height={200}
      />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <a href="/api/auth/logout">logout</a><br/>
    </>
  )
}, { returnTo: '/user'});
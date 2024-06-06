import { Session, getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default async function ConventionPage() {
  const session: Session | null | undefined = await getSession();
  const user = session?.user;

  return (
    user && (
      <>
        {/* <Image
          src={user.picture}
          alt={user.name}
          width={400}
          height={400}
        /> */}
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </>
    )
  )
};
import { auth0 } from "@/libs/auth0";
import DisplayConventions from "@/app/component/DisplayConventions";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth0.getSession();
  if (!session) {
    redirect("/auth/login?returnTo=/conventions");
  }
  const accessToken = (await auth0.getAccessToken()).token;
  const user = session?.user;

  // 大会一覧の取得
  const fetch_convention_list = async () => {

    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/api/convention?user_id=${user?.sub}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (res.ok) {
        const json = await res.json();
        return json
      } else {
        console.log(res.status);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const conventions = await fetch_convention_list();

  return (
    <>
      <DisplayConventions conventions={conventions?.data} />
    </>
  );
}

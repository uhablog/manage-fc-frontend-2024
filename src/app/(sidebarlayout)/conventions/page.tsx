import { Session, getAccessToken, getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import DisplayConventions from "@/app/component/DisplayConventions";

export default withPageAuthRequired(async function Home() {

  const accessToken = (await getAccessToken()).accessToken;
  const session: Session | null | undefined = await getSession();
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
}, {returnTo: '/conventions'});

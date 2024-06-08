import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import DisplayConventions from "../component/DisplayConventions";

export default withPageAuthRequired(async function Home() {

  const accessToken = (await getAccessToken()).accessToken;

  // 大会一覧の取得
  const fetch_convention_list = async () => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/convention/list`, {
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
}, {returnTo: '/'});
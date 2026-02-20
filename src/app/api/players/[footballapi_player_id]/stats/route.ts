import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET(
  request: Request,
  { params }: { params: { footballapi_player_id: string } }
) {
  let accessTokenResult;
  
  try {
    accessTokenResult = await getAccessToken();
  } catch (error) {
    console.error("Failed to get access token:", error);
    return Response.json(
      { message: "Unauthorized - No valid session" },
      { status: 401 }
    );
  }
  
  if (!accessTokenResult?.accessToken) {
    return Response.json(
      { message: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  console.log("Fetching stats for player ID:", params.footballapi_player_id);
  const res = await fetch(
    `${process.env.API_ENDPOINT}/api/players/${params.footballapi_player_id}/stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessTokenResult.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    console.error("プレイヤー統計情報の取得に失敗", res.status);
    return Response.json(
      { message: "プレイヤー統計情報の取得に失敗" },
      { status: res.status }
    );
  }

  const json = await res.json();
  return Response.json(json);
}

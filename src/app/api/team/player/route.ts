import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const footballapi_player_id = searchParams.get('footballapi_player_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/team/player-stats?footballapi_player_id=${footballapi_player_id}&team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (res.ok) {
    const json = await res.json();
    return Response.json({
      player_stats: json
    });
  } else {
    console.error('プレイヤースタッツの取得に失敗');
    console.error(res.status);
    return Response.json({
      success: false,
      message: 'プレイヤースタッツの取得に失敗'
    });
  }
};
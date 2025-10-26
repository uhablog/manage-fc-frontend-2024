import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const accessTokenResult = await getAccessToken();
  console.log('route.ts: ', team_id);
  const res = await fetch(`${process.env.API_ENDPOINT}/api/team?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('Teamの取得に失敗');
    console.error(res.status);
    return Response.json({
      success: false,
      message: 'Teamの取得に失敗'
    });
  }

  const json = await res.json();

  if (Array.isArray(json)) {
    return Response.json({
      squads: json,
    });
  }

  return Response.json(json);
}

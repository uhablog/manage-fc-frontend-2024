import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/scorer?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  console.log(res);

  if (res.ok) {
    const json = await res.json();
    return Response.json({
      success: true,
      data: json
    });
  } else {
    return Response.json({
      message: 'チーム得点王取得失敗',
      success: false
    });
  }
};
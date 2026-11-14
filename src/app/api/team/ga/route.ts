import { auth0 } from "@/libs/auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const accessTokenResult = await auth0.getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/ga-rank?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
    }
  });

  if (res.ok) {
    const json = await res.json();
    return Response.json({
      success: true,
      data: json
    });
  } else {
    return Response.json({
      message: 'チーム内GAランク取得失敗',
      success: false
    });
  }
};
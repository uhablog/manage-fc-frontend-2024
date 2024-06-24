import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/game?team_id=${team_id}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessTokenResult.accessToken}`
      }
    }
  );

  if (res.ok) {

    const json = await res.json();
    return Response.json({
      success: false,
      data: json
    })

  } else {
    console.error('試合情報の取得に失敗');
    return Response.json({
      success: false,
      message: '試合情報取得失敗'
    });
  }

};
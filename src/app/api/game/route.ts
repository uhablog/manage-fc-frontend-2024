import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const game_id = searchParams.get('game_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/game?game_id=${game_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (res.ok) {

    const comment_res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/game/comment?game_id=${game_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessTokenResult.accessToken}`
      }
    });

    const json = await res.json();
    const comment = await comment_res.json();

    return Response.json({
      game: json,
      ...comment,
      success: true
    });
  } else {
    console.error('gameの取得に失敗', res.status);
    return Response.json({
      success: false,
      message: 'gameの取得に失敗'
    });
  };
}
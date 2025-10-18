import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const game_id = searchParams.get('game_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game?game_id=${game_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('gameの取得に失敗', res.status);
    return Response.json({
      success: false,
      message: 'gameの取得に失敗'
    });
  };

  const comment_res = await fetch(`${process.env.API_ENDPOINT}/api/game/comment?game_id=${game_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const game = await res.json();
  const comment = await comment_res.json();

  let enrichedGame = game;
  try {
    const token = ensureBlobToken();
    const userIds = [
      game?.home_team_auth0_user_id ?? null,
      game?.away_team_auth0_user_id ?? null,
    ];
    const emblemUrls = await getLatestBlobUrls(userIds, token);

    enrichedGame = {
      ...game,
      home_team_emblem_url:
        game?.home_team_auth0_user_id && emblemUrls[game.home_team_auth0_user_id]
          ? emblemUrls[game.home_team_auth0_user_id]
          : game?.home_team_emblem_url ?? null,
      away_team_emblem_url:
        game?.away_team_auth0_user_id && emblemUrls[game.away_team_auth0_user_id]
          ? emblemUrls[game.away_team_auth0_user_id]
          : game?.away_team_emblem_url ?? null,
    };
  } catch (error) {
    console.error("Failed to resolve game emblem urls", error);
  }

  return Response.json({
    game: enrichedGame,
    ...comment,
    success: true
  });
}

export async function DELETE(
  request: NextRequest
) {
  const accessTokenResult = await getAccessToken();
  const body = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...body
    })
  });

  const result = await res.json();
  return Response.json({
    ...result
  });
}

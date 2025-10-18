import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get("team_id");
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game?team_id=${team_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessTokenResult.accessToken}`,
    },
  });

  if (!res.ok) {
    console.error("試合情報の取得に失敗");
    return Response.json({
      success: false,
      message: "試合情報取得失敗",
    });
  }

  const json = await res.json();
  const games = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  let emblemUrls: Record<string, string | null> = {};
  try {
    const token = ensureBlobToken();
    const userIds = games.flatMap(
      (game: { home_team_auth0_user_id?: string; away_team_auth0_user_id?: string }) => [
        game.home_team_auth0_user_id,
        game.away_team_auth0_user_id,
      ]
    );
    emblemUrls = await getLatestBlobUrls(userIds, token);
  } catch (error) {
    console.error("Failed to resolve team game emblems", error);
  }

  const enrichedGames = games.map(
    (game: { home_team_auth0_user_id?: string; away_team_auth0_user_id?: string }) => ({
      ...game,
      home_team_emblem_url:
        game.home_team_auth0_user_id && emblemUrls[game.home_team_auth0_user_id]
          ? emblemUrls[game.home_team_auth0_user_id]
          : null,
      away_team_emblem_url:
        game.away_team_auth0_user_id && emblemUrls[game.away_team_auth0_user_id]
          ? emblemUrls[game.away_team_auth0_user_id]
          : null,
    })
  );

  return Response.json({
    success: true,
    data: enrichedGames,
  });
}


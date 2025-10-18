import { getAccessToken } from "@auth0/nextjs-auth0";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(
  request: Request,
  { params }: { params: { id: string}}
) {
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/games?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('gameの取得に失敗',res.status);
    return Response.json({
      message: 'API取得失敗'
    })
  }

  const json = await res.json();
  const games = Array.isArray(json.data) ? json.data : [];

  let emblemUrls: Record<string, string | null> = {};
  try {
    const token = ensureBlobToken();
    const userIds = games.flatMap((game: { home_team_auth0_user_id?: string; away_team_auth0_user_id?: string }) =>
      [game.home_team_auth0_user_id, game.away_team_auth0_user_id]
    );
    emblemUrls = await getLatestBlobUrls(userIds, token);
  } catch (error) {
    console.error("Failed to resolve game emblems", error);
  }

  const enrichedGames = games.map((game: { home_team_auth0_user_id?: string; away_team_auth0_user_id?: string }) => ({
    ...game,
    home_team_emblem_url:
      game.home_team_auth0_user_id && emblemUrls[game.home_team_auth0_user_id]
        ? emblemUrls[game.home_team_auth0_user_id]
        : null,
    away_team_emblem_url:
      game.away_team_auth0_user_id && emblemUrls[game.away_team_auth0_user_id]
        ? emblemUrls[game.away_team_auth0_user_id]
        : null,
  }));

  return Response.json({
    data: enrichedGames,
  });
};

export async function POST(
  request: Request,
) {
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(await request.json())
  });
  const result = await res.json();

  return Response.json({
    result
  });
};

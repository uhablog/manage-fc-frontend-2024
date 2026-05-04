import { auth0 } from "@/libs/auth0";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accessTokenResult = await auth0.getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/games?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
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

  return Response.json({
    data: games,
  });
};

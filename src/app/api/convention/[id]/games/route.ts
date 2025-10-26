import { getAccessToken } from "@auth0/nextjs-auth0";

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

  return Response.json({
    data: games,
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

import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET(
  request: Request,
  { params }: { params: {id: string}}
) {

  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/scorer?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('Scoreの取得に失敗', res.status);
    return Response.json({
      message: 'API取得失敗'
    });
  }

  const json = await res.json();
  const scorers = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  return Response.json({
    data: scorers,
  });
};

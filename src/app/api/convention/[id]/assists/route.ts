import { auth0 } from "@/libs/auth0";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accessTokenResult = await auth0.getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/assists/rank?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
    }
  });

  if (!res.ok) {
    console.error('Assistの取得に失敗', res.status);
    return Response.json({
      message: 'Assistの取得に失敗'
    });
  }

  const json = await res.json();
  return Response.json(json);
};

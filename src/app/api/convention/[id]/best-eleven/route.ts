import { auth0 } from "@/libs/auth0";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accessTokenResult = await auth0.getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/best-eleven?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
    }
  });

  if (res.ok) {
    console.log('res is ok');
    const json = await res.json();
    console.log(json);
    return Response.json({'data': json.data});
  } else {
    console.log(await res.json());
    console.error('ベストイレブンの取得に失敗', res.status);
    return Response.json({
      message: 'API取得処理失敗'
    });
  }
}

export async function POST(
  request: Request,
) {
  const accessTokenResult = await auth0.getAccessToken();
  const body = await request.json();
  // console.log('request body is ', body);
  // return Response.json({});
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/best-eleven`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await res.json();

  return Response.json({result});
}
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(
  request: Request
) {
  const accessTokenResult = await getAccessToken();
  const reqBody = await request.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/convention`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...reqBody,
      is_held: true
    })
  });
  const result = await res.json();

  return Response.json({
    result
  });
}
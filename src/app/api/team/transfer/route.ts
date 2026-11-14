import { auth0 } from "@/libs/auth0";

export async function POST(
  request: Request
) {
  const accessTokenResult = await auth0.getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/team/transfer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(await request.json())
  });
  const json = await res.json();

  return Response.json({
    ...json
  });
};
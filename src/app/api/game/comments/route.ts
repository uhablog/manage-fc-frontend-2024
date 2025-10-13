import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest
) {
  const accessTokenResult = await getAccessToken();
  const session = await getSession();
  const body = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game/comment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...body,
      user_id: session?.user.sub
    })
  });
  const result = await res.json();

  return Response.json({
    ...result
  });
}
import { auth0 } from "@/libs/auth0";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest
) {
  const accessTokenResult = await auth0.getAccessToken();
  const session = await auth0.getSession();
  const body = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/game/comment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`,
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
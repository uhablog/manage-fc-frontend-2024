import { auth0 } from "@/libs/auth0";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest
) {
  const accessTokenResult = await auth0.getAccessToken();
  const body = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/v2/game/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...body
    })
  });

  const result = await res.json();
  return Response.json({
    ...result
  });
}
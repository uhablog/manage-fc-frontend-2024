import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const game_id = searchParams.get('game_id');

  const accessTokenResult = await getAccessToken();
  const result = await fetch(`${process.env.API_ENDPOINT}/api/v2/game/lineup?game_id=${game_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();
  return Response.json({...json});
}

export async function POST(
  request: NextRequest
) {
  const accessTokenResult = await getAccessToken();
  const body = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/v2/game/lineup`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
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
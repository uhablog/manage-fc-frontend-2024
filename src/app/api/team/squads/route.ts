import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  console.log('team squad api');
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');

  const accessTokenResult = await getAccessToken();
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/team/squad?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();

  return Response.json({
    ...json
  });
}
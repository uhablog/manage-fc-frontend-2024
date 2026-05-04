import { auth0 } from "@/libs/auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');

  const accessTokenResult = await auth0.getAccessToken();
  const result = await fetch(`${process.env.API_ENDPOINT}/api/team/squad?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
    }
  });

  const json = await result.json();

  return Response.json({
    ...json
  });
}
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const home_team_auth0_user_id = searchParams.get('home_team_auth0_user_id');
  const away_team_auth0_user_id = searchParams.get('away_team_auth0_user_id');

  const accessTokenResult = await getAccessToken();
  const result = await fetch(`${process.env.API_ENDPOINT}/api/v2/game/head2head?home_team_auth0_user_id=${home_team_auth0_user_id}&away_team_auth0_user_id=${away_team_auth0_user_id}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();
  console.log(json);
  return Response.json({...json});
};
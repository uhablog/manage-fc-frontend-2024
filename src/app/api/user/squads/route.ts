import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get('user_id');

  const accessTokenResult = await getAccessToken();
  const result = await fetch(`${process.env.API_ENDPOINT}/api/user/squads?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();

  return Response.json({
    ...json
  });
};
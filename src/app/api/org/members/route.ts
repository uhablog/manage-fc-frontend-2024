import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const accessTokenResult = await getAccessToken();

  const res = await fetch(`${process.env.API_ENDPOINT}/api/org/members`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (res.ok) {
    const json = await res.json();
    return Response.json(json)
  } else {
    return Response.json({
      success: false
    });
  }

};
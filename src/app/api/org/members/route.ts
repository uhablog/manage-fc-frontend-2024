import { auth0 } from "@/libs/auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const accessTokenResult = await auth0.getAccessToken();

  const res = await fetch(`${process.env.API_ENDPOINT}/api/org/members`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.token}`
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
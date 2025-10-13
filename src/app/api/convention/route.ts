import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const convention_id = searchParams.get('convention_id');
  const user_id = searchParams.get('user_id');
  const accessTokenResult = await getAccessToken();

  console.log('/convention');

  let fetchUrl = `${process.env.API_ENDPOINT}/api/convention`;
  if (convention_id) {
    fetchUrl += `?convention_id=${convention_id}`;
  }
  if (user_id) {
    fetchUrl += `?user_id=${user_id}`;
  }
  const res = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (res.ok) {
    const json = await res.json();
    return Response.json({
      ...json,
      success: true
    });
  } else {
    return Response.json({
      success: false,
      message: '大会情報の取得に失敗'
    })
  }
};

export async function POST(
  request: Request
) {
  const accessTokenResult = await getAccessToken();
  const reqBody = await request.json();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...reqBody,
      is_held: true
    })
  });
  const result = await res.json();

  return Response.json({
    result
  });
};
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export const proxyBackend = async (
  request: NextRequest,
  path: string,
  method: 'GET' | 'POST' | 'PATCH'
) => {
  try {
    const accessTokenResult = await getAccessToken();
    const headers: HeadersInit = {
      Authorization: `Bearer ${accessTokenResult.accessToken}`,
      Accept: 'application/json'
    };
    const init: RequestInit = { method, headers, cache: 'no-store' };
    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      init.body = await request.text();
    }

    const response = await fetch(`${process.env.API_ENDPOINT}${path}`, init);
    const body = await response.text();
    return new Response(body || null, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch (error) {
    console.error('backend proxy error', error);
    return Response.json({ success: false, message: 'APIへの接続に失敗しました' }, { status: 500 });
  }
};

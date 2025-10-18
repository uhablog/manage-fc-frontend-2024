import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const team_id = searchParams.get('team_id');
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/team?team_id=${team_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('Teamの取得に失敗');
    console.error(res.status);
    return Response.json({
      success: false,
      message: 'Teamの取得に失敗'
    });
  }

  const json = await res.json();
  const squads = Array.isArray(json)
    ? json
    : Array.isArray(json?.squads)
      ? json.squads
      : [];

  let emblemUrls: Record<string, string | null> = {};
  try {
    const token = ensureBlobToken();
    const userIds = squads.map((team: { auth0_user_id?: string }) => team.auth0_user_id ?? null);
    emblemUrls = await getLatestBlobUrls(userIds, token);
  } catch (error) {
    console.error("Failed to resolve team emblem", error);
  }

  const enrichedSquads = squads.map((team: { auth0_user_id?: string }) => ({
    ...team,
    emblem_url:
      team.auth0_user_id && emblemUrls[team.auth0_user_id]
        ? emblemUrls[team.auth0_user_id]
        : team?.emblem_url ?? null,
  }));

  if (Array.isArray(json)) {
    return Response.json({
      squads: enrichedSquads,
    });
  }

  if (Array.isArray(json?.squads)) {
    return Response.json({
      ...json,
      squads: enrichedSquads,
    });
  }

  return Response.json({
    squads: enrichedSquads,
  });
}

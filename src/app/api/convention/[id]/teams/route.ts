import { getAccessToken } from "@auth0/nextjs-auth0";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(
  request: Request,
  { params }: { params: {id: string}}
) {
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/convention/teams?q=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('Teamsの取得に失敗', res.status);
    return Response.json({
      message: 'API取得失敗'
    });
  }

  const json = await res.json();
  const teams = Array.isArray(json.data) ? json.data : [];

  let emblemUrls: Record<string, string | null> = {};
  try {
    const token = ensureBlobToken();
    const userIds = teams
      .map((team: { auth0_user_id?: string }) => team.auth0_user_id)
      .filter((id): id is string => typeof id === "string");
    emblemUrls = await getLatestBlobUrls(userIds, token);
  } catch (error) {
    console.error("Failed to resolve team emblems", error);
  }

  const enrichedTeams = teams.map((team: { auth0_user_id?: string }) => ({
    ...team,
    emblem_url:
      team.auth0_user_id && emblemUrls[team.auth0_user_id]
        ? emblemUrls[team.auth0_user_id]
        : null,
  }));

  return Response.json({
    data: enrichedTeams,
  });
}

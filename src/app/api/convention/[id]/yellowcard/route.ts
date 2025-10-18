import { getAccessToken } from "@auth0/nextjs-auth0";
import { ensureBlobToken, getLatestBlobUrls } from "@/libs/emblem";

export async function GET(
  request: Request,
  { params }: {params: {id: string}}
) {
  const accessTokenResult = await getAccessToken();
  const res = await fetch(`${process.env.API_ENDPOINT}/api/yellowcard/rank?convention_id=${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  if (!res.ok) {
    console.error('YellowCardRankの取得に失敗', res.status);
    return Response.json({
      message: 'YellowCardRankの取得に失敗'
    });
  }

  const json = await res.json();
  const yellowCards = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  let emblemUrls: Record<string, string | null> = {};
  try {
    const token = ensureBlobToken();
    const userIds = yellowCards.map((item: { auth0_user_id?: string }) => item.auth0_user_id ?? null);
    emblemUrls = await getLatestBlobUrls(userIds, token);
  } catch (error) {
    console.error("Failed to resolve yellow card emblems", error);
  }

  const enrichedYellowCards = yellowCards.map((item: { auth0_user_id?: string }) => ({
    ...item,
    emblem_url:
      item.auth0_user_id && emblemUrls[item.auth0_user_id]
        ? emblemUrls[item.auth0_user_id]
        : null,
  }));

  return Response.json(enrichedYellowCards);
};

import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url);
  const stat = searchParams.get("stat");
  const accessTokenResult = await getAccessToken();

  const endpoint = `${process.env.API_ENDPOINT}/api/penalty-stop?convention_id=${params.id}`

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessTokenResult.accessToken}`,
    },
  });

  if (!res.ok) {
    console.error("Stat fetch failed", stat ?? "score", res.status);
    return Response.json({
      message: "API取得失敗",
    });
  }

  const json = await res.json();
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  if (stat === "penalty-stop") {
    return Response.json(data);
  }

  return Response.json({
    data,
  });
}

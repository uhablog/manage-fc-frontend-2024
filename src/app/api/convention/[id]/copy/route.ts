import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const accessTokenResult = await getAccessToken();
  const body = await request.json();
  const response = await fetch(
    `${process.env.API_ENDPOINT}/api/convention/${encodeURIComponent(params.id)}/copy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenResult.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const result = await response.json().catch(() => ({
    success: false,
    message: "大会のコピーに失敗しました。",
  }));

  return Response.json(result, { status: response.status });
}

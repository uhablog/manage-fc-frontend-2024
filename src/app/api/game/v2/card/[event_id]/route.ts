import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

const proxyEventRequest = async (
  request: NextRequest,
  eventId: string,
  method: "PATCH" | "DELETE",
) => {
  const accessTokenResult = await getAccessToken();
  const body = method === "PATCH" ? await request.json() : undefined;
  const response = await fetch(
    `${process.env.API_ENDPOINT}/api/v2/game/card/${encodeURIComponent(eventId)}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessTokenResult.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    },
  );
  const result = await response.json().catch(() => ({
    success: false,
    message: "カードイベントの更新に失敗しました。",
  }));
  return Response.json(result, { status: response.status });
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { event_id: string } },
) {
  return proxyEventRequest(request, params.event_id, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { event_id: string } },
) {
  return proxyEventRequest(request, params.event_id, "DELETE");
}

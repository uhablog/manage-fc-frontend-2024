import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const PATCH = (request: NextRequest, { params }: { params: { player_id: string } }) =>
  proxyBackend(request, `/api/admin/players/${params.player_id}/owner`, 'PATCH');

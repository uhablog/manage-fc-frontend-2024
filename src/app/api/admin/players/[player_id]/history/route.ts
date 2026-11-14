import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const dynamic = 'force-dynamic';
export const GET = (request: NextRequest, { params }: { params: { player_id: string } }) =>
  proxyBackend(request, `/api/admin/players/${params.player_id}/history`, 'GET');

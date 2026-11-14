import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const dynamic = 'force-dynamic';
export const GET = (request: NextRequest, { params }: { params: { team_id: string } }) =>
  proxyBackend(request, `/api/admin/api-football/teams/${params.team_id}/squad${request.nextUrl.search}`, 'GET');

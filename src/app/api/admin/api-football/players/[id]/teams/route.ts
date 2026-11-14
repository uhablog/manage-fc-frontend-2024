import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const dynamic = 'force-dynamic';
export const GET = (request: NextRequest, { params }: { params: { id: string } }) =>
  proxyBackend(request, `/api/admin/api-football/players/${params.id}/teams`, 'GET');

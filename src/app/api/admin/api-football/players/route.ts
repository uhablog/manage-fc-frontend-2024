import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const dynamic = 'force-dynamic';
export const GET = (request: NextRequest) =>
  proxyBackend(request, `/api/admin/api-football/players${request.nextUrl.search}`, 'GET');

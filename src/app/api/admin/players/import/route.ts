import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const POST = (request: NextRequest) => proxyBackend(request, '/api/admin/players/import', 'POST');

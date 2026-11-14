import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const PATCH = (request: NextRequest) => proxyBackend(request, '/api/admin/players/bulk-owner', 'PATCH');

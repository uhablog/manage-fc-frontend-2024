import { NextRequest } from "next/server";
import { proxyBackend } from "@/libs/backendProxy";
export const PATCH = (request: NextRequest, { params }: { params: { member_id: string } }) =>
  proxyBackend(request, `/api/admin/members/${params.member_id}/role`, 'PATCH');

import { m2m_access_token } from "@/libs/M2M_client";

export async function GET(
  request: Request
) {
  const m2m_access_token_result = await m2m_access_token();
  console.log(m2m_access_token_result);

  const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${m2m_access_token_result}`
    }
  });
  const json = await res.json();
  return Response.json({
    users: json
  });
}
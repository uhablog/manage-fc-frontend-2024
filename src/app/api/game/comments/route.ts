import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

// export async function GET(
//   request: NextRequest
// ) {
//   const searchParams = request.nextUrl.searchParams;
//   const game_id = searchParams.get('game_id');
//   const accessTokenResult = await getAccessToken();
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/game/comment?game_id=${game_id}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${accessTokenResult.accessToken}`
//     }
//   });

//   if (res.ok) {
//     const json = await res.json();
//     return Response.json({
//       ...json,
//     });
//   } else {
//     console.error('コメントの取得に失敗', res.status);
//     return Response.json({
//       success: false,
//       message: 'コメントの取得に失敗'
//     });
//   };
// };

export async function POST(
  request: NextRequest
) {
  const accessTokenResult = await getAccessToken();
  const session = await getSession();
  const body = await request.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/game/comment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...body,
      user_id: session?.user.sub
    })
  });
  const result = await res.json();

  return Response.json({
    ...result
  });
}
import { Team } from "@/types/Team";
import { TeamStats } from "@/types/TeamStats";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get('user_id');
  const accessTokenResult = await getAccessToken();

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/grade?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();

  const totals = json.data.reduce((acc: TeamStats, item: Team) => ({
    win: acc.win + item.win,
    draw: acc.draw + item.draw,
    lose: acc.lose + item.lose,
    totalScore: acc.totalScore + item.totalScore,
    games: acc.games + item.games,
    totalConceded: acc.totalConceded + item.concededPoints
  }), { win: 0, draw: 0, lose: 0, totalScore: 0, games: 0, totalConceded: 0 });

  return Response.json({
    ...totals
  });
};
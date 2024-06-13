import { Team } from "@/types/Team";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Card, CardContent, Typography } from "@mui/material";
import Head2Head from "./Head2Head";

type Props = {
  user_id: string
}

type TeamStats = {
  win: number;
  draw: number;
  lose: number;
  totalScore: number;
  totalConceded: number;
  games: number;
}

const UserTotalStats = async ({ user_id }: Props) => {

  const accessTokenResult = await getAccessToken();

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/grade?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();
  console.log(json.data);

  const totals = json.data.reduce((acc: TeamStats, item: Team) => ({
    win: acc.win + item.win,
    draw: acc.draw + item.draw,
    lose: acc.lose + item.lose,
    totalScore: acc.totalScore + item.totalScore,
    games: acc.games + item.games,
    totalConceded: acc.totalConceded + item.concededPoints
  }), { win: 0, draw: 0, lose: 0, totalScore: 0, games: 0, totalConceded: 0 });

  return (
    <>
      <Card raised>
        <CardContent>
          <Typography variant="h6" gutterBottom>通算成績</Typography>
          <Typography variant="body2">通算試合: {totals.games}</Typography>
          <Typography variant="body2">通算勝利: {totals.win}</Typography>
          <Typography variant="body2">通算引分: {totals.draw}</Typography>
          <Typography variant="body2">通算敗北: {totals.lose}</Typography>
          <Typography variant="body2">総得点: {totals.totalScore}</Typography>
          <Typography variant="body2">総失点: {totals.totalConceded}</Typography>
          <Typography variant="h6">対戦相手ごとの成績</Typography>
          <Head2Head auth0_user_id={user_id} />
        </CardContent>
      </Card>
    </>
  )
};

export default UserTotalStats;
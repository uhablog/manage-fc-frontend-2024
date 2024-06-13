import { Team } from "@/types/Team";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>通算成績</Typography>
          <List>
            <ListItem
              disableGutters
              secondaryAction={totals.games}
            >
              <ListItemText primary={`通算試合`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={totals.win}
            >
              <ListItemText primary={`通算勝利`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={totals.draw}
            >
              <ListItemText primary={`通算引分`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={totals.lose}
            >
              <ListItemText primary={`通算敗北`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={totals.totalScore}
            >
              <ListItemText primary={`総得点`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={totals.totalConceded}
            >
              <ListItemText primary={`総失点`} />
            </ListItem>
          </List>
          <Typography variant="h6">対戦相手ごとの成績</Typography>
          <Head2Head auth0_user_id={user_id} />
        </CardContent>
      </Card>
    </>
  )
};

export default UserTotalStats;
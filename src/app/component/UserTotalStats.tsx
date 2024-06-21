import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import Head2Head from "./Head2Head";
import { useEffect, useState } from "react";
import { TeamStats } from "@/types/TeamStats";

type Props = {
  user_id: string
}


const UserTotalStats = ({ user_id }: Props) => {

  const [totals, setTotals] = useState<TeamStats>();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/user/grade?user_id=${user_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      setTotals(json);
    };
    fetchStats();
  }, [user_id]);

  return (

    totals && (
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
  )
};

export default UserTotalStats;
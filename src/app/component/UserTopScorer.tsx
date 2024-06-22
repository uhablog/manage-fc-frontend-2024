import { getAccessToken } from "@auth0/nextjs-auth0";
import { Avatar, Card, CardContent, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  user_id: string
}

type Scorer = {
  scorer_name: string
  total_goals: number
  id: string
  rank: string
  footballapi_player_id: string
}

const UserTopScorer = ({ user_id }: Props) => {

  const [ scorers, setScorers ] = useState<Scorer[]>([]);

  useEffect(() => {
    const fetchTopScorer = async () => {
      const res = await fetch(`/api/user/topscorer?user_id=${user_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      if (json.success) {
        setScorers(json.data);
      }
    };
    fetchTopScorer();
  }, [user_id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">トップスコアラー</Typography>
          <List>
            {scorers.map( (scorer: Scorer, index: number) => (
              <ListItem
                key={index}
                disableGutters
                secondaryAction={
                  scorer.total_goals
                }
              >
                <ListItemAvatar>
                  <Avatar alt={`scorer${index+1}`} src={`https://media.api-sports.io/football/players/${scorer?.footballapi_player_id}.png`} ></Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${scorer.scorer_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};

export default UserTopScorer;
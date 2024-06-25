import { Scorer } from "@/types/Scorer";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  team_id: string
}
export const TeamScorerRank = ({team_id}: Props) => {

  const [ teamScorer, setTeamScorer ] = useState<Scorer[]>([]);

  useEffect(() => {
    const fetchTeamScorer = async () => {
      const res = await fetch(`/api/team/scorer?team_id=${team_id}`);
      const json = await res.json();
      if (json.success) {
        setTeamScorer(json.data);
      } else {
        window.alert('チーム内得点王の取得に失敗しました');
      }
    };
    fetchTeamScorer();
  }, [team_id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography>チーム得点ランク</Typography>
          <List>
            {teamScorer?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
              >
                <ListItemAvatar>
                  <Avatar alt={`team scorer ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}/>
                </ListItemAvatar>
                <ListItemText primary={`${player.scorer_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};
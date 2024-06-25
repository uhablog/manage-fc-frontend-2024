import { Assist } from "@/types/Assist";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  team_id: string
}

export const TeamAssistRank = ({team_id}: Props) => {
  const [ teamAssist, setTeamAssist] = useState<Assist[]>([]);

  useEffect(() => {
    const fetchTeamAssist = async () => {
      const res = await fetch(`/api/team/assist?team_id=${team_id}`);
      const json = await res.json();
      if (json.success) {
        setTeamAssist(json.data);
      } else {
        window.alert('チーム内アシストランクの取得に失敗しました。');
      }
    };
    fetchTeamAssist();
  }, [team_id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography>チームアシストランク</Typography>
          <List>
            {teamAssist?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
              >
                <ListItemAvatar>
                  <Avatar alt={`team scorer ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}/>
                </ListItemAvatar>
                <ListItemText primary={`${player.assist_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};
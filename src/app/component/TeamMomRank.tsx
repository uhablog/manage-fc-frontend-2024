import { Mom } from "@/types/Mom";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  team_id: string
}

export const TeamMomRank = ({team_id}: Props) => {
  const [teamMom, setTeamMom] = useState<Mom[]>([]);

  useEffect(() => {
    const fetchTeamMomRank = async () => {
      const res = await fetch(`/api/team/mom?team_id=${team_id}`);
      const json = await res.json();

      if (json.success) {
        console.log(json);
        setTeamMom(json.data);
      } else {
        window.alert('チーム内MOMランクの取得に失敗しました。');
      }
    };
    fetchTeamMomRank();
  }, [team_id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography>チームMOMランク</Typography>
          <List>
            {teamMom?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
              >
                <ListItemAvatar>
                  <Avatar alt={`team scorer ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}/>
                </ListItemAvatar>
                <ListItemText primary={`${player.mom_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};
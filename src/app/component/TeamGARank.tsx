import { GA } from "@/types/GA";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  team_id: string
}

export const TeamGARank = ({team_id}: Props) => {
  const [teamGa, setTeamGa] = useState<GA[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');

  useEffect(() => {
    const fetchGA = async () => {
      const res = await fetch(`/api/team/ga?team_id=${team_id}`);
      const json = await res.json();

      if (json.success) {
        setTeamGa(json.data);
      } else {
        window.alert('チーム内のGAランクの取得に失敗しました')
      }
    };
    fetchGA();
  }, [team_id]);

  const onClose = () => { setOpen(false) };
  const handleClick = (player_id: string) => {
    setSelectedPlayer(player_id);
    setOpen(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography>チームGAランク</Typography>
          <List>
            {teamGa?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.total_points}
                onClick={() => handleClick(player.footballapi_player_id)}
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
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={team_id}
        player_id={selectedPlayer}
      />
    </>
  )
};
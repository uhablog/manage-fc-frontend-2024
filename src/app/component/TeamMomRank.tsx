import { Mom } from "@/types/Mom";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  team_id: string
}

export const TeamMomRank = ({team_id}: Props) => {

  const [teamMom, setTeamMom] = useState<Mom[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');

  useEffect(() => {
    const fetchTeamMomRank = async () => {
      const res = await fetch(`/api/team/mom?team_id=${team_id}`);
      const json = await res.json();

      if (json.success) {
        setTeamMom(json.data);
      } else {
        window.alert('チーム内MOMランクの取得に失敗しました。');
      }
    };
    fetchTeamMomRank();
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
          <Typography>チームMOMランク</Typography>
          <List>
            {teamMom?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
                onClick={() => handleClick(player.footballapi_player_id)}
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
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={team_id}
        player_id={selectedPlayer}
      />
    </>
  )
};
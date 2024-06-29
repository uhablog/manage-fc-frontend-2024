import { Squad } from "@/types/Squads";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  team_id: string
}

const TeamSquad = ({team_id}: Props) => {

  const [ squads, setSquads ] = useState<Squad[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');

  useEffect(() => {
    const fetchSquads = async () => {
      const res = await fetch(`/api/team/squads?team_id=${team_id}`);
      const json = await res.json();
      setSquads(json.squads);
    };
    fetchSquads()
  }, [team_id]);

  const onClose = () => {
    setOpen(false);
  }

  const handleClick = (player_id: string) => {
    setSelectedPlayer(player_id);
    setOpen(true);
  }

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6"component="p">スカッド</Typography>
              <List>
                {squads.map( (player, index) => (
                  <ListItem
                    key={index}
                    disableGutters
                    sx={{width: '320px'}}
                    onClick={() => handleClick(player.footballapi_player_id)}
                  >
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} />
                    </ListItemAvatar>
                    <ListItemText primary={`${player.player_name}`} />
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
        </Grid2>
      </Grid2>
    </>
  )
}

export default TeamSquad;
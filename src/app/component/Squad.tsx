import { Squad } from "@/types/Squads";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  user_id: string
}
const DisplaySquad = ({user_id}: Props) => {

  const [ squads, setSquads ] = useState<Squad[]>([]);

  useEffect(() => {
    const fetchSquads = async () => {
      const res = await fetch(`/api/user/squads?user_id=${user_id}`, {method: 'GET'});
      const json = await res.json();
      setSquads(json.squads);
    };
    fetchSquads()
  }, [user_id]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6"component="p">スカッド</Typography>
            <List>
              {squads.map( (player, index) => (
                <ListItem
                  key={index}
                  disableGutters
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
      </Grid2>
    </Grid2>
  )
};

export default DisplaySquad;
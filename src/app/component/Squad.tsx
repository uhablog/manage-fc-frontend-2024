import { Squad } from "@/types/Squads";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  squad: Squad[]
}
const DisplaySquad = ({squad}: Props) => {

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6"component="p">スカッド</Typography>
            <List>
              {squad.map( (player, index) => (
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
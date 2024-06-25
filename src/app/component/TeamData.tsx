import { Team } from "@/types/Team";
import { Card, CardContent, List, ListItem, ListItemText } from "@mui/material";

type Props = {
  team_data: Team
}
export const TeamData = ({team_data}: Props) => {
  return (
    <Card>
      <CardContent>
        <List>
          <ListItem
            secondaryAction={team_data?.games}
          >
            <ListItemText primary={`試合数`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.win}
          >
            <ListItemText primary={`勝利`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.draw}
          >
            <ListItemText primary={`引分`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.lose}
          >
            <ListItemText primary={`敗北`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
};
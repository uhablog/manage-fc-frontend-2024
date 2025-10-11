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
            sx={{
              borderRadius: 1,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                boxShadow: 1,
                transform: "translateY(-1px)"
              }
            }}
          >
            <ListItemText primary={`試合数`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.win}
            sx={{
              borderRadius: 1,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                boxShadow: 1,
                transform: "translateY(-1px)"
              }
            }}
          >
            <ListItemText primary={`勝利`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.draw}
            sx={{
              borderRadius: 1,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                boxShadow: 1,
                transform: "translateY(-1px)"
              }
            }}
          >
            <ListItemText primary={`引分`} />
          </ListItem>
          <ListItem
            secondaryAction={team_data?.lose}
            sx={{
              borderRadius: 1,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                boxShadow: 1,
                transform: "translateY(-1px)"
              }
            }}
          >
            <ListItemText primary={`敗北`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
};
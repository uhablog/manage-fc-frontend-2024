import { Team } from "@/types/Team";
import { Box, Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";

type Props = {
  teamData: Team
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TeamDetailHeader = ({teamData, value, handleChange}: Props) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="p">今大会成績</Typography>
        <Typography variant="h6" component="p">
          {teamData?.team_name}: {teamData?.manager_name}
        </Typography>
        <List>
          <ListItem
            secondaryAction={teamData?.games}
          >
            <ListItemText primary={`試合数`} />
          </ListItem>
          <ListItem
            secondaryAction={teamData?.win}
          >
            <ListItemText primary={`勝利`} />
          </ListItem>
          <ListItem
            secondaryAction={teamData?.draw}
          >
            <ListItemText primary={`引分`} />
          </ListItem>
          <ListItem
            secondaryAction={teamData?.lose}
          >
            <ListItemText primary={`敗北`} />
          </ListItem>
        </List>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="概要" {...a11yProps(0)} />
            <Tab label="スカッド" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </CardContent>
    </Card>
  )
};

export default TeamDetailHeader;
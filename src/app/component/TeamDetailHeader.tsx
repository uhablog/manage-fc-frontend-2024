import { Team } from "@/types/Team";
import { Box, Button, Card, CardContent, Link as MuiLink, Tab, Tabs, Typography } from "@mui/material";
import NextLink from 'next/link';

type Props = {
  convention_id: string
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

const TeamDetailHeader = ({
  convention_id,
  teamData,
  value,
  handleChange
}: Props) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="p">今大会成績</Typography>
        <Typography variant="h6" component="p">
          {teamData?.team_name}: {teamData?.manager_name}
        </Typography>
        <MuiLink component={NextLink} underline="none" href={`/conventions/${convention_id}`}>
          <Button color="primary">大会へ</Button>
        </MuiLink>
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
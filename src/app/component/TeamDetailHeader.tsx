'use client'

import { useMemo } from "react";
import { useEmblemUrls } from "@/hooks/useEmblemUrls";
import { Team } from "@/types/Team";
import { Avatar, Box, Button, Card, CardContent, Stack, Tab, Tabs, Typography } from "@mui/material";
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

  const userIds = useMemo(() => [teamData.auth0_user_id], [teamData.auth0_user_id]);
  const emblemUrl = useEmblemUrls(userIds);

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={emblemUrl[teamData.auth0_user_id] ?? undefined}
            alt={`${teamData.team_name} emblem`}
            sx={{ width: 64, height: 64}}
          >
            {teamData.team_name?.charAt(0) ?? "?"}
          </Avatar>
          <Box>
            <Typography variant="h5" component="p">
              {teamData?.team_name}
            </Typography>
            <Typography variant="h6" component="p">
              {teamData?.manager_name}
            </Typography>
          </Box>
          </Stack>
          <Button
            color="primary"
            component={NextLink}
            href={`/conventions/${convention_id}`}
          >
            大会へ
          </Button>
        </Stack>
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

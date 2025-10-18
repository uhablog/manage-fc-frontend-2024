import { TeamGame } from "@/types/TeamGames";
import { Avatar, Card, CardContent, Link as MuiLink,Stack,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useMemo, useState } from "react";
import NextLink from 'next/link';
import { useEmblemUrls } from "@/hooks/useEmblemUrls";

type Props = {
  team_id: string
}
const TeamGamesCard = ({
  team_id
}: Props) => {

  const [ teamGames, setTeamGames ] = useState<TeamGame[]>([]);

  useEffect(() => {
    const fetchTeamGames = async () => {
      const res = await fetch(`/api/team/games?team_id=${team_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      setTeamGames(json.data);
    };
    fetchTeamGames();
  }, [team_id]);

  const userIds = useMemo(
    () =>
      teamGames.flatMap((game) => [game.home_team_auth0_user_id, game.away_team_auth0_user_id]),
    [teamGames]
  );
  const emblemUrls = useEmblemUrls(userIds);

  return (
    <Card>
      <CardContent>
        <Typography>試合結果</Typography>
          {teamGames?.map( (game, index) => (
            <MuiLink
              key={index}
              component={NextLink}
              underline="none"
              color={'black'}
              href={`/conventions/${game.convention_id}/games/detail/${game.id}`}
              sx={{
                display: "block",
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                  boxShadow: 1,
                  transform: "translateY(-1px)"
                }
              }}
            >
              <Grid2 container spacing={2}>
                <Grid2 xs={5} display='flex' justifyContent='right' >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" component="p" textAlign="right">
                      {game?.home_team_name}
                    </Typography>
                    <Avatar
                      src={emblemUrls[game.home_team_auth0_user_id] ?? undefined}
                      alt={`${game.home_team_name} emblem`}
                      sx={{ width: 32, height: 32 }}
                    >
                      {game.home_team_name?.charAt(0) ?? "?"}
                    </Avatar>
                  </Stack>
                </Grid2>
                <Grid2 xs={2} display={'flex'} justifyContent='center'>
                  <Typography
                    variant="h6"
                    component="p"
                  >
                    {game.home_team_score} - {game.away_team_score}
                  </Typography>
                </Grid2>
                <Grid2 xs={5} display='flex' justifyContent='left'>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={emblemUrls[game.away_team_auth0_user_id] ?? undefined}
                      alt={`${game.away_team_name} emblem`}
                      sx={{ width: 32, height: 32 }}
                    >
                      {game.away_team_name?.charAt(0) ?? "?"}
                    </Avatar>
                    <Typography variant="body1" component="p" textAlign="right">
                      {game?.away_team_name}
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>
            </MuiLink>
          ))}
      </CardContent>
    </Card>
  )
};

export default TeamGamesCard;
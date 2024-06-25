import { TeamGame } from "@/types/TeamGames";
import { Card, CardContent, Link as MuiLink,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from 'next/link';

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
                '&:hover': {
                  color: 'blue',
                  textDecoration: 'underline'
                }
              }}
            >
              <Grid2 container spacing={2}>
                <Grid2 xs={5} display='flex' justifyContent='right' >
                  <Typography>{game.home_team_name}</Typography>
                </Grid2>
                <Grid2 xs={2} display={'flex'} justifyContent='center'>
                  <Typography>{game.home_team_score} - {game.away_team_score}</Typography>
                </Grid2>
                <Grid2 xs={5} display='flex' justifyContent='left'>
                  <Typography>{game.away_team_name}</Typography>
                </Grid2>
              </Grid2>
            </MuiLink>
          ))}
      </CardContent>
    </Card>
  )
};

export default TeamGamesCard;
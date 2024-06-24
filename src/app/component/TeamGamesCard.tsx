import { TeamGame } from "@/types/TeamGames";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  team_id: string
}
const TeamGamesCard = ({team_id}: Props) => {

  const [ teamGames, setTeamGames ] = useState<TeamGame[]>([]);

  useEffect(() => {
    const fetchTeamGames = async () => {
      const res = await fetch(`/api/team/games?team_id=${team_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      console.log(json);
      setTeamGames(json.data);
    };
    fetchTeamGames();
  }, [team_id]);

  return (
    <Card>
      <CardContent>
        <Grid2 container spacing={2}>
          {teamGames?.map( (game, index) => (
            <Box key={index}>
              <Grid2 md={3}>
                <Typography>{game.home_team_name}</Typography>
              </Grid2>
              <Grid2 md={3}>
                <Typography>{game.home_team_score}</Typography>
              </Grid2>
              <Grid2 md={3}>
                <Typography>{game.away_team_score}</Typography>
              </Grid2>
              <Grid2 md={3}>
                <Typography>{game.away_team_name}</Typography>
              </Grid2>
            </Box>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  )
};

export default TeamGamesCard;
import { Game } from "@/types/Game";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  game_id: string
}

const GameDetail = ({ game_id }: Props) => {

  const [ game, setGame ] = useState<Game>();
  const [ error, setError ] = useState<boolean>();

  useEffect( () => {
    const fetchGame = async () => {
      const res = await fetch(`/api/game?game_id=${game_id}`);
      const json = await res.json();
      console.log(json);

      if (json.success) {
        setGame(json.data);
      } else {
        setError(true);
      }
    };

    fetchGame();
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid2 container spacing={2}>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'right'}} >
            <Typography variant="h6" component="p">
              {game?.home_team_name}
            </Typography>
          </Grid2>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'center'}} >
            <Typography variant="h6" component="p">
              {game?.home_team_score} - {game?.away_team_score}
            </Typography>
          </Grid2>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'left'}} >
            <Typography variant="h6" component="p">
              {game?.away_team_name}
            </Typography>
          </Grid2>
          <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'right'}} >
            <Typography variant="body1" component="p">
              {game?.home_team_scorer.map((scorer, index) => (
                <Box key={index}>{scorer}</Box>
              ))}
            </Typography>
          </Grid2>
          <Grid2 xs={2} sx={{display: 'flex', justifyContent: 'center'}} ></Grid2>
          <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'left'}} >
            <Typography variant="body1" component="p">
              {game?.away_team_scorer.map((scorer, index) => (
                <Box key={index}>{scorer}</Box>
              ))}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  )
};

export default GameDetail;
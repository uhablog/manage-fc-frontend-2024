import { Game } from "@/types/Game"
import { Person, SportsSoccer } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  game: Game | undefined
}

const GameScore = ({ game }: Props) => {
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
                <Box key={index}>{scorer.name}</Box>
              ))}
            </Typography>
          </Grid2>
          <Grid2 xs={2} sx={{display: 'flex', justifyContent: 'center'}} >
            <SportsSoccer/>
          </Grid2>
          <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'left'}} >
            <Typography variant="body1" component="p">
              {game?.away_team_scorer.map((scorer, index) => (
                <Box key={index}>{scorer.name}</Box>
              ))}
            </Typography>
          </Grid2>
          <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'right'}} >
            <Typography variant="body1" component="p">
              {game?.home_team_assists.map((assist, index) => (
                <Box key={index}>{assist.name}</Box>
              ))}
            </Typography>
          </Grid2>
          <Grid2 xs={2} sx={{display: 'flex', justifyContent: 'center'}} >
            <Person/>
          </Grid2>
          <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'left'}} >
            <Typography variant="body1" component="p">
              {game?.away_team_assists.map((assist, index) => (
                <Box key={index}>{assist.name}</Box>
              ))}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  )
};

export default GameScore;
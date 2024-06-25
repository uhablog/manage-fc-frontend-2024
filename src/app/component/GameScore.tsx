import { Game } from "@/types/Game"
import { Person, SportsSoccer } from "@mui/icons-material";
import { Box, Card, CardContent, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NextLink from 'next/link';

type Props = {
  convention_id: string
  game: Game | undefined
}

const GameScore = ({
  convention_id,
  game
}: Props) => {
  return (
    <Card>
      <CardContent>
        <Grid2 container spacing={2}>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'right'}} >
            <MuiLink
              component={NextLink}
              underline="none"
              color={'black'}
              href={`/conventions/${convention_id}/team/${game?.home_team_id}`}
              sx={{
                '&:hover': {
                  color: 'blue',
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography variant="h6" component="p">
                {game?.home_team_name}
              </Typography>
            </MuiLink>
          </Grid2>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'center'}} >
            <Typography variant="h6" component="p">
              {game?.home_team_score} - {game?.away_team_score}
            </Typography>
          </Grid2>
          <Grid2 xs={4} sx={{display: 'flex', justifyContent: 'left'}} >
            <MuiLink
              component={NextLink}
              underline="none"
              color={'black'}
              href={`/conventions/${convention_id}/team/${game?.away_team_id}`}
              sx={{
                '&:hover': {
                  color: 'blue',
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography variant="h6" component="p">
                {game?.away_team_name}
              </Typography>
            </MuiLink>
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
import { Game } from "@/types/Game"
import { Card, CardContent, Fab, Link as MuiLink,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Add } from "@mui/icons-material";
import NextLink from "next/link";

type Props = {
  convention_id: string
  games: Game[]
}

const DisplayGames = ({ convention_id, games }: Props) => {
  
  return (
    <>
      <Grid2 container spacing={2}>
        { games?.map((game, index) => (
          <Grid2 xs={12} sm={6} md={3} key={index}>
            <MuiLink component={NextLink} underline="none" href={`/conventions/${convention_id}/games/detail/${game.game_id}`}>
              <Card>
                <CardContent>
                  <Grid2 container>
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
                  </Grid2>
                </CardContent>
              </Card>
            </MuiLink>
          </Grid2>
        ))}
      </Grid2>
      <MuiLink component={NextLink} underline="none" href={`/conventions/${convention_id}/games/add`} >
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
        >
          <Add />
        </Fab>
      </MuiLink>
    </>
  )
};

export default DisplayGames;
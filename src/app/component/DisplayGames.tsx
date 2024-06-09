import { Game } from "@/types/Game"
import { Card, CardContent, Fab, Link as MuiLink,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import GameDetail from "./GameDetail";
import { Add } from "@mui/icons-material";
import NextLink from "next/link";

type Props = {
  convention_id: string
  games: Game[]
}

const DisplayGames = ({ convention_id, games }: Props) => {
  
  const [open, setOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleClickOpen = (game: Game) => {
    setSelectedGame(game);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Grid2 container spacing={2}>
        { games?.map((game, index) => (
          <>
            <Grid2 xs={12} sm={6} md={3} key={index}>
              <Card onClick={() => handleClickOpen(game)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component='div'>{game.home_team_name} {game.home_team_score}</Typography>
                  <Typography gutterBottom variant="h5" component='div'>{game.away_team_name} {game.away_team_score}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          </>
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
      <GameDetail game={selectedGame} open={open} onClose={handleClose} />
    </>
  )
};

export default DisplayGames;
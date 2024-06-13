import { Game } from "@/types/Game"
import { Card, CardContent, Fab, Link as MuiLink,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Add } from "@mui/icons-material";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type Props = {
  convention_id: string
}

const DisplayGames = ({ convention_id }: Props) => {
  const [games, setGames] = useState<Game[]>([]);

  // 試合一覧の取得
  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(`/api/convention/${convention_id}/games`);
      const json = await res.json()
      setGames(json.data);
    }
    fetchGames();
  }, [convention_id]);
  
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Card>
            <CardContent>
              { games?.map((game, index) => (
                <MuiLink key={index} component={NextLink} underline="none" href={`/conventions/${convention_id}/games/detail/${game.game_id}`}>
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
                </MuiLink>
              ))}
            </CardContent>
          </Card>
        </Grid2>
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
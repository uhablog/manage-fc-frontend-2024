import { Game } from "@/types/Game"
import { Button, Card, CardContent, Fab, Link as MuiLink,Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Add } from "@mui/icons-material";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type Props = {
  convention_id: string
  initialLimit?: number
  addButtonDisplay?: boolean
}

const DisplayGames = ({ convention_id, initialLimit, addButtonDisplay = true }: Props) => {

  const [games, setGames] = useState<Game[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);

  // 試合一覧の取得
  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(`/api/convention/${convention_id}/games`);
      const json = await res.json()
      setGames(json.data);
    }
    fetchGames();
  }, [convention_id]);

  const showAllGames = () => {
    setLimit(undefined);  // 'すべて表示'をクリックしたらlimitを解除
  };

  const hideLimit = () => {
    if (initialLimit) {
      setLimit(initialLimit);
    } else {
      setLimit(5);
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component={'p'}>試合結果</Typography>
          {(limit ? games.slice(0, limit): games).map((game, index) => (
            <MuiLink
              key={index}
              component={NextLink}
              underline="none"
              color='black'
              href={`/conventions/${convention_id}/games/detail/${game.game_id}`}
              sx={{
                '&:hover': {
                  color: 'blue',
                  textDecoration: 'underline'
                },
              }}
            >
              <Grid2 container>
                <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'right'}} >
                  <Typography variant="h6" component="p">
                    {game?.home_team_name}
                  </Typography>
                </Grid2>
                <Grid2 xs={2} sx={{display: 'flex', justifyContent: 'center'}} >
                  <Typography variant="h6" component="p">
                    {game?.home_team_score} - {game?.away_team_score}
                  </Typography>
                </Grid2>
                <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'left'}} >
                  <Typography variant="h6" component="p">
                    {game?.away_team_name}
                  </Typography>
                </Grid2>
              </Grid2>
            </MuiLink>
          ))}
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllGames}>すべて表示</Button>
          }
        </CardContent>
      </Card>
      {
        addButtonDisplay && (
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
        )
      }
    </>
  )
};

export default DisplayGames;
import { Game } from "@/types/Game"
import { Avatar, Button, Card, CardContent, Fab, Link as MuiLink, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Add } from "@mui/icons-material";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useEmblemUrls } from "@/hooks/useEmblemUrls";

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

  const userIds = useMemo(
    () =>
      games.flatMap((game) => [game.home_team_auth0_user_id, game.away_team_auth0_user_id]),
    [games]
  );
  const emblemUrls = useEmblemUrls(userIds);
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
          {(limit ? games.slice(0, limit): games).map((game) => (
            <MuiLink
              key={game.game_id}
              component={NextLink}
              underline="none"
              color='black'
              href={`/conventions/${convention_id}/games/detail/${game.game_id}`}
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
              <Grid2 container>
                <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'right'}} >
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
                <Grid2 xs={2} sx={{display: 'flex', justifyContent: 'center'}} >
                  <Typography variant="h6" component="p">
                    {game?.home_team_score} - {game?.away_team_score}
                  </Typography>
                </Grid2>
                <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'left'}} >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={emblemUrls[game.away_team_auth0_user_id] ?? undefined}
                      alt={`${game.away_team_name} emblem`}
                      sx={{ width: 32, height: 32 }}
                    >
                      {game.away_team_name?.charAt(0) ?? "?"}
                    </Avatar>
                    <Typography variant="body1" component="p">
                      {game?.away_team_name}
                    </Typography>
                  </Stack>
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

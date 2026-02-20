import { PlayerRating } from "@/types/PlayerRating";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import NextLink from "next/link";

type Props = {
  id: string
  initialLimit?: number
}

export const DisplayRatingRank = ({
  id,
  initialLimit
}: Props) => {

  const [ players, setPlayers ] = useState<PlayerRating[]>([]);
  const [ limit, setLimit ] = useState<number | undefined>(initialLimit);

  useEffect(() => {
    const fetchPlayerRatingRank = async () => {
      const res = await fetch(`/api/convention/${id}/player-ratings`);
      const json = await res.json();
      setPlayers(json.data);
    }

    fetchPlayerRatingRank();
  }, [id]);

  const showAllPlayers = () => {
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
          <Typography variant="h6" component="p">Top Rating</Typography>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? players.slice(0, limit) : players).map((player, index) => (
                <MuiLink
                  key={index}
                  component={NextLink}
                  underline="none"
                  color='black'
                  href={`/player/${player.footballapi_player_id}?convention_id=${id}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <ListItem
                    disableGutters
                    sx={{
                      borderRadius: 1,
                      transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        boxShadow: 1,
                        transform: "translateY(-1px)"
                      }
                    }}
                  >
                      <Grid2 xs={1}>
                        <Typography variant="body2">{player.rank_in_convention}</Typography>
                      </Grid2>
                      <Grid2 xs={2}>
                        <ListItemAvatar>
                          <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} />
                        </ListItemAvatar>
                      </Grid2>
                      <Grid2 xs={6}>
                        <Typography
                          component="p"
                          sx={{
                            fontWeight: "bold"
                          }}
                        >{player.player_name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={player.emblem_url ?? undefined}
                            alt={`${player.team_name} emblem`}
                            sx={{ width: 20, height: 20}}
                          >
                            {player.player_name?.charAt(0) ?? "?"}
                          </Avatar>
                          <MuiLink
                            component={NextLink}
                            underline="none"
                            color={'black'}
                            href={`/conventions/${id}/team/${player.team_id}`}
                            sx={{
                              '&:hover': {
                                color: 'blue',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            <Typography variant="body2">{player.team_name}</Typography>
                          </MuiLink>
                        </Stack>
                      </Grid2>
                      <Grid2 xs={3}>
                        <Typography>{player.avg_rating}({player.rating_count}試合)</Typography>
                      </Grid2>
                  </ListItem>
                </MuiLink>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllPlayers}>すべて表示</Button>
          }
        </CardContent>
      </Card>
    </>
  )
};
import { Assist } from "@/types/Assist";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  id: string
  initialLimit?: number
}

const DisplayAssistRankCard = ({id, initialLimit}: Props) => {

  const [assists, setAssists] = useState<Assist[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  const [ selectedTeamId, setSelectedTeamId ] = useState<string>('');

  // アシストランクの取得
  useEffect(() => {
    const fetchAssistRank = async () => {
      const res = await fetch(`/api/convention/${id}/assists`);
      const json = await res.json();
      setAssists(json);
    };
    fetchAssistRank();
  }, [id]);

  const showAllAssists = () => {
    setLimit(undefined);  // 'すべて表示'をクリックしたらlimitを解除
  };

  const hideLimit = () => {
    if (initialLimit) {
      setLimit(initialLimit);
    } else {
      setLimit(5);
    }
  }

  const onClose = () => { setOpen(false) };
  const handleClick = (player_id: string, team_id: string) => {
    setSelectedPlayer(player_id);
    setSelectedTeamId(team_id);
    setOpen(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="p">Assists</Typography>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? assists.slice(0, limit) : assists).map((assist, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  onClick={() => handleClick(assist.footballapi_player_id, assist.team_id)}
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
                      <Typography variant="body2">{assist.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <ListItemAvatar>
                        <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${assist.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{assist.assist_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={assist.emblem_url ?? undefined}
                          alt={`${assist.team_name} emblem`}
                          sx={{ width: 25, height: 25}}
                        >
                          {assist.assist_name?.charAt(0) ?? "?"}
                        </Avatar>
                        <MuiLink
                          component={NextLink}
                          underline="none"
                          color={'black'}
                          href={`/conventions/${id}/team/${assist.team_id}`}
                          sx={{
                            '&:hover': {
                              color: 'blue',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          <Typography variant="body2">{assist.team_name}</Typography>
                        </MuiLink>
                      </Stack>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{assist.score}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllAssists}>すべて表示</Button>
          }
        </CardContent>
      </Card>
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={selectedTeamId}
        player_id={selectedPlayer}
      />
    </>
  )
};

export default DisplayAssistRankCard;

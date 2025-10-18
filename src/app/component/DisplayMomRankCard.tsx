import { Mom } from "@/types/Mom";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useMemo, useState } from "react";
import NextLink from 'next/link';
import { PlayerStatsDialog } from "./PlayerStatsDialog";
import { useEmblemUrls } from "@/hooks/useEmblemUrls";

type Props = {
  id: string
  initialLimit?: number
}

const DisplayMomRankCard = ({id, initialLimit}: Props) => {

  const [mom, setMom] = useState<Mom[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  const [ selectedTeamId, setSelectedTeamId ] = useState<string>('');
  const userIds = useMemo(
    () => mom.map((item) => item.auth0_user_id),
    [mom]
  );
  const emblemUrls = useEmblemUrls(userIds);

  // アシストランクの取得
  useEffect(() => {
    const fetchMomRank = async () => {
      const res = await fetch(`/api/convention/${id}/mom`);
      const json = await res.json();
      setMom(json);
    };
    fetchMomRank();
  }, [id]);

  const showAllMom = () => {
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
          <Typography variant="h6" component="p">MOM</Typography>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? mom.slice(0, limit) : mom).map((mom_data, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  onClick={() => handleClick(mom_data.footballapi_player_id, mom_data.team_id)}
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
                      <Typography variant="body2">{mom_data.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <ListItemAvatar>
                        <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${mom_data.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{mom_data.mom_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={emblemUrls[mom_data.auth0_user_id] ?? undefined}
                          alt={`${mom_data.team_name} emblem`}
                          sx={{ width: 25, height: 25 }}
                        >
                          {mom_data.team_name?.charAt(0) ?? "?"}
                        </Avatar>
                        <MuiLink
                          component={NextLink}
                          underline="none"
                          color={'black'}
                          href={`/conventions/${id}/team/${mom_data.team_id}`}
                          sx={{
                            '&:hover': {
                              color: 'blue',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          <Typography variant="body2">{mom_data.team_name}</Typography>
                        </MuiLink>
                      </Stack>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{mom_data.score}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllMom}>すべて表示</Button>
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

export default DisplayMomRankCard;

import { Scorer } from "@/types/Scorer";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from 'next/link';
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  id: string
  initialLimit?: number
}

const DisplayScorer = ({ id, initialLimit }: Props) => {
  
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  const [ selectedTeamId, setSelectedTeamId ] = useState<string>('');

  // 得点者の取得
  useEffect(() => {
    const fetchScorer = async () => {
      const res = await fetch(`/api/convention/${id}/score`);
      const json = await res.json();
      setScorers(json.data);
    }

    fetchScorer();
  }, [id]);

  const showAllScorers = () => {
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
          <List>
            <Grid2 container spacing={2}>
              {(limit ? scorers.slice(0, limit) : scorers).map((scorer, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  onClick={() => handleClick(scorer.footballapi_player_id, scorer.team_id)}
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
                      <Typography variant="body2">{scorer.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <ListItemAvatar>
                        <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${scorer.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{scorer.scorer_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <MuiLink
                        component={NextLink}
                        underline="none"
                        color={'black'}
                        href={`/conventions/${id}/team/${scorer.team_id}`}
                        sx={{
                          '&:hover': {
                            color: 'blue',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        <Typography variant="body2">{scorer.team_name}</Typography>
                      </MuiLink>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{scorer.score}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllScorers}>すべて表示</Button>
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

export default DisplayScorer;
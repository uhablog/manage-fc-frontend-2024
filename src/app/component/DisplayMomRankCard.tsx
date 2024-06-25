import { Mom } from "@/types/Mom";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from 'next/link';

type Props = {
  id: string
  initialLimit?: number
}

const DisplayMomRankCard = ({id, initialLimit}: Props) => {

  const [mom, setMom] = useState<Mom[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);

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

  return (
    <>
      <Card>
        <CardContent>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? mom.slice(0, limit) : mom).map((mom_data, index) => (
                <ListItem
                  key={index}
                  disableGutters
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
    </>
  )
};

export default DisplayMomRankCard;
import { GA } from "@/types/GA";
import { Avatar, Button, Card, CardContent, List, ListItem, ListItemAvatar, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from 'next/link';

type Props = {
  id: string
  initialLimit?: number
}

const DisplayGARankCard = ({id, initialLimit}: Props) => {

  const [ga_rank, setGaRank] = useState<GA[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);

  // アシストランクの取得
  useEffect(() => {
    const fetchGaRank = async () => {
      const res = await fetch(`/api/convention/${id}/ga`);
      const json = await res.json();
      setGaRank(json);
    };
    fetchGaRank();
  }, [id]);

  const showAllGa = () => {
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
              {(limit ? ga_rank.slice(0, limit) : ga_rank).map((ga_data, index) => (
                <ListItem
                  key={index}
                  disableGutters
                >
                    <Grid2 xs={1}>
                      <Typography variant="body2">{ga_data.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <ListItemAvatar>
                        <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${ga_data.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{ga_data.scorer_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <MuiLink
                        component={NextLink}
                        underline="none"
                        color={'black'}
                        href={`/conventions/${id}/team/${ga_data.team_id}`}
                        sx={{
                          '&:hover': {
                            color: 'blue',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        <Typography variant="body2">{ga_data.team_name}</Typography>
                      </MuiLink>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{ga_data.total_points}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllGa}>すべて表示</Button>
          }
        </CardContent>
      </Card>
    </>
  )
};

export default DisplayGARankCard;
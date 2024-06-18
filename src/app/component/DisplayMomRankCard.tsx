import { Mom } from "@/types/Mom";
import { Button, Card, CardContent, List, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

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
                    <Grid2 xs={4}>
                      <Typography variant="body2">{mom_data.mom_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{mom_data.team_name}</Typography>
                    </Grid2>
                    <Grid2 xs={3}>
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
import { GA } from "@/types/GA";
import { Button, Card, CardContent, List, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

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
                    <Grid2 xs={4}>
                      <Typography variant="body2">{ga_data.scorer_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{ga_data.team_name}</Typography>
                    </Grid2>
                    <Grid2 xs={3}>
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
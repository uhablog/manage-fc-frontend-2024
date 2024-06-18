import { Assist } from "@/types/Assist";
import { Button, Card, CardContent, List, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  id: string
  initialLimit?: number
}

const DisplayAssistRankCard = ({id, initialLimit}: Props) => {

  const [assists, setAssists] = useState<Assist[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);

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

  return (
    <>
      <Card>
        <CardContent>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? assists.slice(0, limit) : assists).map((assist, index) => (
                <ListItem
                  key={index}
                  disableGutters
                >
                    <Grid2 xs={1}>
                      <Typography variant="body2">{assist.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{assist.assist_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{assist.team_name}</Typography>
                    </Grid2>
                    <Grid2 xs={3}>
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
    </>
  )
};

export default DisplayAssistRankCard;
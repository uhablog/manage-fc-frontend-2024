import { Scorer } from "@/types/Scorer";
import { Card, CardContent, List, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  id: string
}

const DisplayScorer = ({ id }: Props) => {
  
  const [scorers, setScorers] = useState<Scorer[]>([]);

  // 得点者の取得
  useEffect(() => {
    const fetchScorer = async () => {
      const res = await fetch(`/api/convention/${id}/score`);
      const json = await res.json();
      setScorers(json.data);
    }

    fetchScorer();
  }, [id]);

  return (
    <>
      <Card>
        <CardContent>
          <List>
            <Grid2 container spacing={2}>
              {scorers.map(( scorer, index) => (
                <ListItem
                  key={index}
                  disableGutters
                >
                    <Grid2 xs={1}>
                      <Typography variant="body2">{scorer.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{scorer.scorer_name}</Typography>
                    </Grid2>
                    <Grid2 xs={4}>
                      <Typography variant="body2">{scorer.team_name}</Typography>
                    </Grid2>
                    <Grid2 xs={3}>
                      <Typography variant="body2">{scorer.score}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
        </CardContent>
      </Card>
    </>
  )
};

export default DisplayScorer;
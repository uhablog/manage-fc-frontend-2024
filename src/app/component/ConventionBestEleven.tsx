import { BestElevenPlayer } from "@/types/BestElevenPlayer";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Fab, Link as MuiLink, Typography } from "@mui/material";
import NextLink from 'next/link';
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

type Props = {
  convention_id: string
}

const DisplayBestEleven = ({
  convention_id
}: Props) => {

  const [ bestEleven, setBestEleven ] = useState<BestElevenPlayer[]>([]);

  useEffect(() => {

    const fetchBestElevenPlayers = async () => {
      const res = await fetch(`/api/convention/${convention_id}/best-eleven`);
      const json = await res.json();
      console.log(json);
      setBestEleven(json.data);
    }

    fetchBestElevenPlayers();
  }, [convention_id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component={'p'} >ベストイレブン</Typography>
          {bestEleven.map(( player, index) => (
            <Grid2 container key={index}>
              <Grid2 xs={5} sx={{display: 'flex', justifyContent: 'right'}}>
                <Typography>{player.player_name}</Typography>
              </Grid2>
            </Grid2>
          ))}
        </CardContent>
      </Card>
      <MuiLink
        component={NextLink}
        underline="none"
        href={`/conventions/${convention_id}/best-eleven/add`}
      >
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
        >
          <Add/>
        </Fab>
      </MuiLink>
    </>
  )
};

export default DisplayBestEleven;
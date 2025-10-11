import { BestElevenPlayer } from "@/types/BestElevenPlayer";
import { Add } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, Fab, Link as MuiLink, Typography } from "@mui/material";
import NextLink from 'next/link';
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

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
      
      // GK, DF, MF, FWの順に並べ替え
      const positionOrder: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 };
      const sortedBestEleven = [...json.data].sort((a, b) => {
        const orderA = positionOrder[a.position] ?? 99;
        const orderB = positionOrder[b.position] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.player_name.localeCompare(b.player_name, 'ja');
      });

      setBestEleven(sortedBestEleven);
    }

    fetchBestElevenPlayers();
  }, [convention_id]);

  /**
   * ユーザースタッツダイアログの表示
   */
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  const [ selectedPlayerTeamId, setSelectedPlayerTeamId ] = useState<string>('');

  const onClose = () => { setOpen(false) };
  const handleClick = (player_id: string, team_id: string) => {
    setSelectedPlayer(player_id);
    setSelectedPlayerTeamId(team_id);
    setOpen(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="p">ベストイレブン</Typography>
          {bestEleven.length === 0 ? (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              まだ登録されていません。
            </Typography>
          ) : (
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
              {bestEleven.map((player) => (
                <Grid2
                  key={player.id}
                  xs={12} sm={6} md={4}
                  onClick = {() => handleClick(player.footballapi_player_id.toString(), player.team_id)}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        borderColor: "primary.main"
                      }
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}
                        alt={player.player_name}
                        sx={{ width: 64, height: 64 }}
                      />
                      <Box>
                        <Typography variant="subtitle1">{player.player_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {player.position}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          )}
        </CardContent>
      </Card>
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={selectedPlayerTeamId}
        player_id={selectedPlayer}
      />
      {
        bestEleven.length < 11 && (
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
        )
      }
    </>
  )
};

export default DisplayBestEleven;
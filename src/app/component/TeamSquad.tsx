import { Squad } from "@/types/Squads";
import { useEffect, useState } from "react";
import { Avatar, Card, CardContent, Fab, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import { PlayerStatsDialog } from "./PlayerStatsDialog";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TransferDialog } from "./TransferDialog";

type Props = {
  team_id: string
  auth0_user_id: string
}

const TeamSquad = ({team_id, auth0_user_id}: Props) => {

  // user情報取得
  const { user, error, isLoading } = useUser();

  const [ squads, setSquads ] = useState<Squad[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  
  // 移籍ダイアログ関連
  const [ openTransferDialog, setOpenTransferDialog ] = useState<boolean>(false);

  useEffect(() => {
    const fetchSquads = async () => {
      const res = await fetch(`/api/team/squads?team_id=${team_id}`);
      const json = await res.json();
      console.log(json.squads);
      setSquads(json.squads);
    };
    fetchSquads()
  }, [team_id]);

  const onClose = () => {
    setOpen(false);
  }

  const onCloseTransferDialog = () => {
    setOpenTransferDialog(false);
  }

  const handleClick = (player_id: string) => {
    setSelectedPlayer(player_id);
    setOpen(true);
  }

  if (isLoading) return <>Loading...</>
  if (error) return <div>{error.message}</div>

  return (
    user && (
      <>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ px: 2, pb: 1 }}
            >
              <Typography variant="caption">G</Typography>
              <Typography variant="caption">A</Typography>
              <Typography variant="caption">Rating</Typography>
              <Typography variant="caption">試合</Typography>
            </Stack>
            <List>
              {squads.map( (player, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{width: '320px'}}
                  onClick={() => handleClick(player.footballapi_player_id)}
                  secondaryAction={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2">{player.goals}</Typography>
                      <Typography variant="body2">{player.assists}</Typography>
                      <Typography variant="body2">{player.avg_rating ? player.avg_rating : 0}</Typography>
                      <Typography variant="body2">{player.rating_count}</Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} />
                  </ListItemAvatar>
                  <ListItemText primary={player.player_name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <PlayerStatsDialog
          open={open}
          onClose={onClose}
          team_id={team_id}
          player_id={selectedPlayer}
        />
        { user.sub === auth0_user_id &&
          <>
            <Fab
              color="primary"
              onClick={() => setOpenTransferDialog(true)}
            >
              移籍
            </Fab>
            <TransferDialog
              open={openTransferDialog}
              onClose={onCloseTransferDialog}
              squad={squads}
              team_id={team_id}
            />
          </>
        }
      </>
    )
  )
}

export default TeamSquad;

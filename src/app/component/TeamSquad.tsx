import { Squad } from "@/types/Squads";
import { useEffect, useState } from "react";
import { Avatar, Card, CardContent, Fab, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
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
  console.log(user);

  return (
    user && (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6"component="p">スカッド</Typography>
            <List>
              {squads.map( (player, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{width: '320px'}}
                  onClick={() => handleClick(player.footballapi_player_id)}
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} />
                  </ListItemAvatar>
                  <ListItemText primary={`${player.player_name}`} />
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
        />
      </>
    )
  )
}

export default TeamSquad;
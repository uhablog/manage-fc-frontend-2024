import { Squad } from "@/types/Squads";
import { useEffect, useMemo, useState } from "react";
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

  const groupedSquads = useMemo(() => {
    const groups: Record<string, Squad[]> = {};
    squads.forEach((player) => {
      const rawPosition = player.potision || player.position || "その他";
      const key = typeof rawPosition === "string" ? rawPosition.toUpperCase() : "その他";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(player);
    });
    return groups;
  }, [squads]);

  const orderedPositions = useMemo(() => {
    const preferredOrder = ["FW", "MF", "DF", "GK"];
    const existingPositions = Object.keys(groupedSquads);
    const preferred = preferredOrder.filter((pos) => existingPositions.includes(pos));
    const rest = existingPositions
      .filter((pos) => !preferredOrder.includes(pos))
      .sort();
    return [...preferred, ...rest];
  }, [groupedSquads]);

  if (isLoading) return <>Loading...</>
  if (error) return <div>{error.message}</div>

  return (
    user && (
      <>
        {orderedPositions.map((position) => {
          const players = groupedSquads[position];
          if (!players || players.length === 0) return null;
          return (
            <Card key={position} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {position}
                </Typography>
                <List>
                  {players.map((player) => (
                    <ListItem
                      key={player.footballapi_player_id}
                      disableGutters
                      sx={{ width: '320px' }}
                      onClick={() => handleClick(player.footballapi_player_id)}
                    >
                      <ListItemAvatar>
                        <Avatar alt={player.player_name} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.player_name}
                        secondary={`試合数:${player.rating_count} / G:${player.goals} / A:${player.assists} / Rating:${player.avg_rating ? player.avg_rating : 0}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )
        })}
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

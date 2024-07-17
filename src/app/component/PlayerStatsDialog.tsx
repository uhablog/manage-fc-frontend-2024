import { PlayerStats } from "@/types/PlayerStats";
import { Avatar, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean,
  onClose: () => void,
  team_id: string
  player_id: string
}
export const PlayerStatsDialog = ({
  open,
  onClose,
  team_id,
  player_id
}: Props) => {

  const [ player, setPlayer] = useState<PlayerStats>();

  useEffect(() => {
    const fetchPlayerStats = async () => {
      const res = await fetch(`/api/team/player?footballapi_player_id=${player_id}&team_id=${team_id}`);
      const json = await res.json();
      setPlayer(json.player_stats)
    };
    if (player_id !== '' && team_id !== '') {
      fetchPlayerStats();
    }
  }, [player_id, team_id]);

  return (
    <>
      <Dialog
        onClose={onClose}
        open={open}
        fullWidth
      >
        <DialogTitle>
          <Avatar alt="player image" src={`https://media.api-sports.io/football/players/${player?.footballapi_player_id}.png`} />
          {player?.player_name}
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem
              disableGutters
              secondaryAction={player?.goals}
            >
              <ListItemText primary={`得点数`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={player?.assists}
            >
              <ListItemText primary={`アシスト数`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={player?.mom_count}
            >
              <ListItemText primary={`MOM数`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={player?.yellow_cards}
            >
              <ListItemText primary={`イエローカード数`} />
            </ListItem>
            <ListItem
              disableGutters
              secondaryAction={player?.red_cards}
            >
              <ListItemText primary={`レッドカード数`} />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  )
};
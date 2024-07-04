import { Squad } from "@/types/Squads";
import { Team } from "@/types/Team";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  open: boolean,
  onClose: () => void,
  squad: Squad[]
}

export const TransferDialog = ({
  open,
  onClose,
  squad
}: Props) => {

  const [ transferPlayerId, setTransferPlayerId ] = useState<string>('');
  const [ transferTeamId, setTransferTeamId ] = useState<string>('');
  const [ teams, setTeams ] = useState<Team[]>([]);

  const params = useParams();

  useEffect(() => {
    const fetchTeams = async (convention_id: string) => {
      const res = await fetch(`/api/convention/${convention_id}/teams`);
      const json = await res.json();
      setTeams(json.data);
    }
    fetchTeams(params?.id as string);
  }, [params]);

  const handleClick = () => {
    window.alert(`移籍登録！, ${transferPlayerId}, ${transferTeamId}`);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
      >
        <DialogTitle>
          移籍する
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="移籍する選手を選択"
            value={transferPlayerId}
            onChange={(e) => setTransferPlayerId(e.target.value)}
            fullWidth
            margin="normal"
          >
            { squad.map( (player, index) => (
              <MenuItem key={index} value={player.id}>
                {player.player_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="移籍先を選択"
            value={transferTeamId}
            onChange={(e) => setTransferTeamId(e.target.value)}
            fullWidth
            margin="normal"
          >
            { teams.map( (team, index) => (
              <MenuItem key={index} value={team.id}>
                {team.team_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>移籍登録</Button>
        </DialogActions>
      </Dialog>
    </>
  )
};
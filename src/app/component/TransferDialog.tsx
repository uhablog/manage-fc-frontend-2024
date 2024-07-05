import { Squad } from "@/types/Squads";
import { Team } from "@/types/Team";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  open: boolean,
  onClose: () => void,
  squad: Squad[],
  team_id: string
}

export const TransferDialog = ({
  open,
  onClose,
  squad,
  team_id
}: Props) => {

  const [ transferPlayerId, setTransferPlayerId ] = useState<string>('');
  const [ afterTransferTeamId, setAfterTransferTeamId ] = useState<string | undefined>('');
  const [ transferTeamAuth0Id, setTransferTeamAuth0Id ] = useState<string | undefined>('');
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

  // 移籍先チームが変更された時の処理
  const handleChangeTransferTeam = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const team = teams.find( t => t.id === e.target.value);
    console.log(team);
    setAfterTransferTeamId(team?.id);
    setTransferTeamAuth0Id(team?.auth0_user_id);
  };

  const handleClick = async () => {
    window.alert(`移籍登録！, ${transferPlayerId}, ${afterTransferTeamId}`);
    const res = await fetch(`/api/team/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        player_id: transferPlayerId,
        before_team_id: team_id,
        after_team_id: afterTransferTeamId,
        auth0_user_id: transferTeamAuth0Id
      })
    });
    const json = await res.json();
    console.log(json);
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
            value={afterTransferTeamId}
            onChange={handleChangeTransferTeam}
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
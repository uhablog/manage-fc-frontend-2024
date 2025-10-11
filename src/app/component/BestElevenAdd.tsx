import { BestElevenPlayer } from "@/types/BestElevenPlayer";
import { Squad } from "@/types/Squads";
import { Team } from "@/types/Team";
import { Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  convention_id: string
};

export type RegisterBestElevenPlayer = {
  footballapi_player_id: number
  player_name: string
  position: string
  team_id: string
}

const defaultPlayer: RegisterBestElevenPlayer = {
  footballapi_player_id: 0,
  player_name: '',
  position: '',
  team_id: ''
};

const positionOptions = ['FW', 'MF', 'DF', 'GK'];

const BestElevenAdd = ({ convention_id }: Props) => {

  const router = useRouter();
  const [ teams, setTeams ] = useState<Team[]>([]);
  const [ players, setPlayers ] = useState<{[key: string]: Squad[]}>({});
  const [ formPlayers, setFormPlayers ] = useState<RegisterBestElevenPlayer[]>(Array(11).fill(defaultPlayer));

  /**
   * 初期表示時に大会参加チームを取得
   */
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`/api/convention/${convention_id}/teams`);
        const json = await res.json();
        setTeams(json.data);
      } catch (error) {
        console.error('チームの取得に失敗しました。');
      }
    };
    fetchTeams();
  }, [convention_id]);

  /**
   * チーム選択時に選手一覧を取得する
   * @param teamId チームID
   * @returns チームのメンバーを格納する
   */
  const fetchPlayers = async (teamId: string) => {
    // 既に取得済みのチームの場合はスキップする
    if (!teamId || players[teamId]) return;

    try {
      const res = await fetch(`/api/team/squads?team_id=${teamId}`);
      const json = await res.json();
      setPlayers((prev) => ({ ...prev, [teamId]: json.squads}));
    } catch (error) {
      console.error('選手データの取得に失敗しました', error);
    }
  };

  const handleChange = (index: number, field: keyof RegisterBestElevenPlayer, value: string) => {
    const updatedPlayers = [...formPlayers];

    if (field === 'player_name') {
      const selectedTeamPlayers = players[formPlayers[index].team_id] || [];
      const selectedPlayer = selectedTeamPlayers.find((p) => p.player_name === value);
      console.log('selectedTeamPlayers',selectedTeamPlayers);
      console.log('selectedPlayer', selectedPlayer);
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        player_name: selectedPlayer? selectedPlayer.player_name: '',
        footballapi_player_id: selectedPlayer? Number(selectedPlayer.footballapi_player_id) : 0
      };
    } else {
      updatedPlayers[index] = {...updatedPlayers[index], [field]: value};
    }

    // チーム選択時に選手一覧を取得
    if (field === 'team_id') {
      fetchPlayers(value);
      updatedPlayers[index].player_name = '';
    }

    setFormPlayers(updatedPlayers);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/convention/${convention_id}/best-eleven`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          convention_id: convention_id,
          players: formPlayers
        })
      });
      const result = await response.json();
      if (result.result.success) {
        router.push(`/conventions/${convention_id}`);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error('Faild to submit best eleven: ', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" mb={2}>
          ベストイレブンを入力してください
        </Typography>
        {formPlayers.map((formPlayer, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                選手 {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                      label="所属チーム"
                      select
                      value={formPlayer.team_id}
                      onChange={(e) => handleChange(index, 'team_id', e.target.value)}
                      fullWidth
                  >
                    <MenuItem value=""><em>選択してください</em></MenuItem>
                    {teams.map( (team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.team_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="名前"
                    select
                    value={formPlayer.player_name}
                    onChange={(e) => handleChange(index, 'player_name', e.target.value)}
                    fullWidth
                    disabled={!formPlayer.team_id}
                  >
                    <MenuItem value=""><em>選択してください</em></MenuItem>
                    {players[formPlayer.team_id]?.map((player) => (
                      <MenuItem key={player.id} value={player.player_name}>
                        {player.player_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="ポジション"
                    select
                    value={formPlayer.position}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    fullWidth
                  >
                    {positionOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>送信</Button>
        </Box>
      </form>
    </>
  )
};

export default BestElevenAdd;
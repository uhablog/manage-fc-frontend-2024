import { Squad } from "@/types/Squads";
import { Team } from "@/types/Team";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  convention_id: string
  teams: Team[]
}

const GameAddV2 = ({ convention_id, teams}: Props) => {

  const router = useRouter();
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>('');
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>('');
  const [errors, setErrors] = useState<{
    selectedSameTeam: boolean,
    homeTeam: boolean,
    awayTeam: boolean,
  }>({
    selectedSameTeam: false,
    homeTeam: false,
    awayTeam: false,
  });

  /**
   * 選択チームが変更されたときに実行し、
   * 選択チームの設定と選択チームのスカッドを取得
   * @param event チェンジイベント
   * @param setSelectedTeam 選択チームのセッター
   */
  const handleTeamChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setSelectedTeam: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setSelectedTeam(event.target.value);
  };

  const validateForm = () => {
    const errors = {
      selectedSameTeam: selectedHomeTeam === selectedAwayTeam && selectedHomeTeam !== '' && selectedAwayTeam !== '', 
      homeTeam: !selectedHomeTeam,
      awayTeam: !selectedAwayTeam,
    };
  
    setErrors(errors);
  
    // Object.values()を使ってエラーオブジェクトのすべての値をチェックし、いずれかがtrueであれば全体のバリデーションはfalseを返す
    return !Object.values(errors).some(isError => isError);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    const homeTeam = teams.find(team => team.id === selectedHomeTeam);
    const awayTeam = teams.find(team => team.id === selectedAwayTeam);

    if (!homeTeam || !awayTeam) return;

    try {
      const response = await fetch(`/api/game/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conventionId: convention_id,
          homeTeamId: selectedHomeTeam,
          awayTeamId: selectedAwayTeam,
          homeTeamName: homeTeam.team_name,
          awayTeamName: awayTeam.team_name
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        router.push(`/conventions/${convention_id}/games/detail/${result.id}`);
      } else {
        window.alert('試合の登録に失敗');
      }
    } catch (error) {
      console.error('Failed to submit game result:', error);
    }
  };

  return (
    <>
      <Box sx={{
        margin: 3
      }}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 md={6} xs={12} >
              <Typography
                sx={{
                  color: 'success.main'
                }}
              >ホームチーム選択欄</Typography>
              <TextField
                select
                label="ホームチームを選択"
                value={selectedHomeTeam}
                color="success"
                onChange={(e) => handleTeamChange(e, setSelectedHomeTeam)}
                fullWidth
                margin="normal"
                error={errors.homeTeam}
                helperText={errors.homeTeam ? 'ホームチームを選択してください。' : ''}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.team_name}
                  </MenuItem>
                ))}
              </TextField>
              { errors.selectedSameTeam && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'error.main'
                  }}
                >アウェイチームと同じチームを選択することはできません。</Typography>
              )}
            </Grid2>
            <Grid2 md={6} xs={12} >
              <Typography
                sx={{
                  color: 'primary.main'
                }}
              >アウェイチーム選択欄</Typography>
              <TextField
                select
                label="アウェイチームを選択"
                value={selectedAwayTeam}
                onChange={(e) => handleTeamChange(e, setSelectedAwayTeam)}
                color="primary"
                fullWidth
                margin="normal"
                error={errors.awayTeam}
                helperText={errors.awayTeam ? 'アウェイチームを選択してください。' : ''}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.team_name}
                  </MenuItem>
                ))}
              </TextField>
              { errors.selectedSameTeam && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'error.main'
                  }}
                >ホームチームと同じチームを選択することはできません。</Typography>
              )}
            </Grid2>
          </Grid2>
          <Button type="submit" variant="contained" color="primary">
            試合を開始
          </Button>
        </form>
      </Box>
    </>
  )
};

export default GameAddV2;
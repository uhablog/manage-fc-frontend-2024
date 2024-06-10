import { Team } from "@/types/Team";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  convention_id: string
  teams: Team[]
}

const GameAdd = ({ convention_id, teams}: Props) => {

  const router = useRouter();
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>('');
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>('');
  const [homeTeamScore, setHomeTeamScore] = useState<number>();
  const [awayTeamScore, setAwayTeamScore] = useState<number>();
  const [homeTeamScorer, setHomeTeamScorer] = useState<string[]>([]);
  const [awayTeamScorer, setAwayTeamScorer] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    selectedSameTeam: boolean,
    homeTeam: boolean,
    awayTeam: boolean,
    homeScore: boolean,
    awayScore: boolean,
    homeScorers: boolean,
    awayScorers: boolean,
  }>({
    selectedSameTeam: false,
    homeTeam: false,
    awayTeam: false,
    homeScore: false,
    awayScore: false,
    homeScorers: false,
    awayScorers: false,
  });

  const handleHomeScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(event.target.value, 10);

    if (score < 0 || Number.isNaN(score)) {
      setHomeTeamScore(0);
      setHomeTeamScorer([]);
    } else {
      setHomeTeamScore(score);
      setHomeTeamScorer(new Array(score).fill(''));
    }
  };

  const handleAwayScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(event.target.value, 10);

    if (score < 0 || Number.isNaN(score)) {
      setAwayTeamScore(0);
      setAwayTeamScorer([]);
    } else {
      setAwayTeamScore(score);
      setAwayTeamScorer(new Array(score).fill(''));
    }
  };

  const handleScorerChange = (scorerArray: string[], setScorer: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const newScorers = [...scorerArray];
    newScorers[index] = value;
    setScorer(newScorers);
  };

  const validateForm = () => {
    const errors = {
      selectedSameTeam: selectedHomeTeam === selectedAwayTeam && selectedHomeTeam !== '' && selectedAwayTeam !== '', 
      homeTeam: !selectedHomeTeam,
      awayTeam: !selectedAwayTeam,
      homeScore: Number.isNaN(homeTeamScore) || homeTeamScore === undefined,
      awayScore: Number.isNaN(awayTeamScore) || awayTeamScore === undefined,
      homeScorers: homeTeamScorer.some(s => !s),
      awayScorers: awayTeamScorer.some(s => !s),
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
      const response = await fetch(`/api/convention/${convention_id}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conventionId: convention_id,
          homeTeamId: selectedHomeTeam,
          awayTeamId: selectedAwayTeam,
          homeTeamName: homeTeam.team_name,
          awayTeamName: awayTeam.team_name,
          homeTeamScore,
          awayTeamScore,
          homeTeamScorer,
          awayTeamScorer,
        }),
      });
      const result = await response.json();
      console.log(result); // Optionally handle the result

      if (result.result.success) {
        router.push(`/conventions/${convention_id}`);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error('Failed to submit game result:', error);
    }
  };

  return (
    <>
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
              onChange={(e) => setSelectedHomeTeam(e.target.value)}
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
            <Typography
              sx={{
                color: 'success.main'
              }}
            >ホームチームの得点</Typography>
            <TextField
              type="number"
              value={homeTeamScore}
              onChange={handleHomeScoreChange}
              color="success"
              fullWidth
              margin="normal"
              error={errors.homeScore}
              helperText={errors.homeScore ? 'ホームチームの得点数を入力してください。' : ''}
            />
            { (homeTeamScorer.length > 0) && <>
              <Typography
                sx={{
                  color: 'success.main'
                }}
              >ホームチームの得点者</Typography>
            </>}
            {homeTeamScorer.map((_, index) => (
              <TextField
                key={index}
                label={`ホームチーム得点者${index + 1}`}
                value={homeTeamScorer[index]}
                onChange={(e) => handleScorerChange(homeTeamScorer, setHomeTeamScorer, index, e.target.value)}
                color="success"
                fullWidth
                margin="normal"
                error={homeTeamScorer[index] === ''}
                helperText={homeTeamScorer[index] === '' ? '得点者を入力してください。' : ''}
              />
            ))}
          </Grid2>
          <Grid2 md={6} xs={12} >
            <Typography
              sx={{
                color: 'primary.main'
              }}
            >アウェイチーム入力欄</Typography>
            <TextField
              select
              label="アウェイチームを選択"
              value={selectedAwayTeam}
              onChange={(e) => setSelectedAwayTeam(e.target.value)}
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
            <Typography
              sx={{
                color: 'primary.main'
              }}
            >アウェイチームの得点</Typography>
            <TextField
              type="number"
              value={awayTeamScore}
              onChange={handleAwayScoreChange}
              color="primary"
              fullWidth
              margin="normal"
              error={errors.awayScore}
              helperText={errors.awayScore ? 'アウェイチームの得点数を入力してください。' : ''}
            />
            { awayTeamScorer.length > 0 && <>
              <Typography
                sx={{
                  color: 'primary.main'
                }}
              >アウェイチームの得点者</Typography>
            </>}
            {awayTeamScorer.map((_, index) => (
              <TextField
                key={index}
                label={`アウェイチーム得点数${index + 1}`}
                value={awayTeamScorer[index]}
                onChange={(e) => handleScorerChange(awayTeamScorer, setAwayTeamScorer, index, e.target.value)}
                color="primary"
                fullWidth
                margin="normal"
                error={awayTeamScorer[index] === ''}
                helperText={awayTeamScorer[index] === '' ? '得点者を入力してください。' : ''}
              />
            ))}
          </Grid2>
        </Grid2>
        <Button type="submit" variant="contained" color="primary">
          試合結果を登録
        </Button>
      </form>
    </>
  )
};

export default GameAdd;
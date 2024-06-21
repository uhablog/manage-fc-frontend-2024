import { Squad } from "@/types/Squads";
import { Team } from "@/types/Team";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
  const [homeTeamScorer, setHomeTeamScorer] = useState<Squad[]>([]);
  const [awayTeamScorer, setAwayTeamScorer] = useState<Squad[]>([]);
  const [homeTeamAssist, setHomeTeamAssist] = useState<number>();
  const [awayTeamAssist, setAwayTeamAssist] = useState<number>();
  const [homeTeamAssists, setHomeTeamAssists] = useState<Squad[]>([]);
  const [awayTeamAssists, setAwayTeamAssists] = useState<Squad[]>([]);
  const [homeTeamSquads, setHomeTeamSquads] = useState<Squad[]>([]);
  const [awayTeamSquads, setAwayTeamSquads] = useState<Squad[]>([]);
  const [momTeamSquads, setMomTeamSquads] = useState<Squad[]>([]);
  const [momTeam, setMomTeam] = useState<string>('');
  const [mom, setMom] = useState<Squad>();
  const [errors, setErrors] = useState<{
    selectedSameTeam: boolean,
    homeTeam: boolean,
    awayTeam: boolean,
    homeScore: boolean,
    awayScore: boolean,
    homeScorers: boolean,
    awayScorers: boolean,
    homeAssist: boolean,
    awayAssist: boolean,
    homeAssists: boolean,
    awayAssists: boolean,
    momTeam: boolean
    invalidMomTeam: boolean,
    mom: boolean
  }>({
    selectedSameTeam: false,
    homeTeam: false,
    awayTeam: false,
    homeScore: false,
    awayScore: false,
    homeScorers: false,
    awayScorers: false,
    homeAssist: false,
    awayAssist: false,
    homeAssists: false,
    awayAssists: false,
    momTeam: false,
    invalidMomTeam: false,
    mom: false,
  });

  const handleMomChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const mom = momTeamSquads.find( player => player.footballapi_player_id === event.target.value);
    setMom(mom);
  };

  /**
   * 選択チームが変更されたときに実行し、
   * 選択チームの設定と選択チームのスカッドを取得
   * @param event チェンジイベント
   * @param setSelectedTeam 選択チームのセッター
   * @param setTeamSquads 選択チームスカッドのセッター
   */
  const handleTeamChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setSelectedTeam: React.Dispatch<React.SetStateAction<string>>,
    setTeamSquads: React.Dispatch<React.SetStateAction<Squad[]>>
  ) => {
    const selectedTeam = teams.find(team => team.id === event.target.value);
    const res = await fetch(`/api/user/squads?user_id=${selectedTeam?.auth0_user_id}`, {method: 'GET'});
    const json = await res.json();
    setSelectedTeam(event.target.value);
    setTeamSquads(json.squads);
  };

  const handleScoreChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setTeamScore: React.Dispatch<React.SetStateAction<number|undefined>>,
    setTeamScorer: React.Dispatch<React.SetStateAction<Squad[]>>
  ) => {
    const score = parseInt(event.target.value, 10);

    if (score < 0 || Number.isNaN(score)) {
      setTeamScore(0);
      setTeamScorer([]);
    } else {
      setTeamScore(score);
      setTeamScorer(new Array(score).fill(''));
    }
  };

  const handleScorerChange = (
    squads: Squad[],
    scorers: Squad[], 
    setTeamScorer: React.Dispatch<React.SetStateAction<Squad[]>>,
    index: number,
    value: string
  ) => {
    const scorer = squads.find( player => player.footballapi_player_id === value);

    if (scorer) {
      const newScorers = [...scorers];
      newScorers[index] = {
        ...scorer
      }
      setTeamScorer(newScorers);
    } else {
      window.alert('正しい選手を入力してください。');
    }
  };

  const validateForm = () => {
    const errors = {
      selectedSameTeam: selectedHomeTeam === selectedAwayTeam && selectedHomeTeam !== '' && selectedAwayTeam !== '', 
      homeTeam: !selectedHomeTeam,
      awayTeam: !selectedAwayTeam,
      homeScore: Number.isNaN(homeTeamScore) || homeTeamScore === undefined,
      awayScore: Number.isNaN(awayTeamScore) || awayTeamScore === undefined,
      homeScorers: homeTeamScorer.some(s => !s.id),
      awayScorers: awayTeamScorer.some(s => !s.id),
      homeAssist: Number.isNaN(homeTeamAssist) || homeTeamAssist === undefined,
      awayAssist: Number.isNaN(awayTeamAssist) || awayTeamAssist === undefined,
      homeAssists: homeTeamAssists.some(s => !s.id),
      awayAssists: awayTeamAssists.some(s => !s.id),
      momTeam: !momTeam,
      // MOM所属チームはホームチームorアウェイチームで選択されたチームでないといけない
      invalidMomTeam: !(momTeam === selectedHomeTeam || momTeam === selectedAwayTeam),
      mom: !mom
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
          homeTeamAssists,
          awayTeamAssists,
          momTeam,
          mom
        }),
      });
      const result = await response.json();

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
          <Grid2 md={6} xs={12}>
            <Typography
              sx={{
                color: 'secondary.main'
              }}
            >MOM所属チーム選択</Typography>
            <TextField
              select
              label="MOM所属チームを選択"
              value={momTeam}
              color="secondary"
             onChange={(e) => handleTeamChange(e, setMomTeam, setMomTeamSquads)}
              fullWidth
              margin="normal"
              error={errors.momTeam}
              helperText={errors.momTeam ? 'MOM所属チームを選択してください。' : ''}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.team_name}
                </MenuItem>
              ))}
            </TextField>
            { errors.invalidMomTeam && (
              <Typography
                variant="caption"
                sx={{
                  color: 'error.main'
                }}
              >MOM所属チームはホームチームorアウェイチームで選択されたチームを選んでください。</Typography>
            )}
          </Grid2>
          <Grid2 md={6} xs={12}>
            <Typography
              sx={{
                color: 'secondary.main'
              }}
            >MOM</Typography>
            <TextField
              select
              label={`MOM`}
              value={mom}
              color="secondary"
              onChange={(e) => handleMomChange(e)}
              fullWidth
              margin="normal"
              error={mom?.player_name === undefined}
              helperText={mom?.footballapi_player_id ? 'MOMを選択してください。' : ''}
            >
              {
                momTeamSquads.map((player) => (
                  <MenuItem key={player.id} value={player.footballapi_player_id}>
                    {player.player_name}
                  </MenuItem>
                ))
              }
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
                color: 'success.main'
              }}
            >ホームチーム選択欄</Typography>
            <TextField
              select
              label="ホームチームを選択"
              value={selectedHomeTeam}
              color="success"
              onChange={(e) => handleTeamChange(e, setSelectedHomeTeam, setHomeTeamSquads)}
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
              onChange={(e) => handleScoreChange(e, setHomeTeamScore, setHomeTeamScorer)}
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
                select
                label={`得点者${index+1}を選択`}
                value={homeTeamScorer[index].footballapi_player_id ?? ''}
                color="success"
                onChange={(e) => handleScorerChange( homeTeamSquads, homeTeamScorer, setHomeTeamScorer,index, e.target.value)}
                fullWidth
                margin="normal"
                error={errors.homeTeam}
                helperText={errors.homeTeam ? '得点者を選択してください。' : ''}
              >
                {homeTeamSquads.map((player) => (
                  <MenuItem key={player.id} value={player.footballapi_player_id}>
                    {player.player_name}
                  </MenuItem>
                ))}
              </TextField>
            ))}
            <Typography
              sx={{
                color: 'success.main'
              }}
            >ホームチームのアシスト数</Typography>
            <TextField
              type="number"
              value={homeTeamAssist}
              onChange={(e) => handleScoreChange(e, setHomeTeamAssist, setHomeTeamAssists)}
              color="success"
              fullWidth
              margin="normal"
              error={errors.homeAssist}
              helperText={errors.homeAssist ? 'ホームチームのアシスト数を入力してください。' : ''}
            />
            { (homeTeamAssists.length > 0) && <>
              <Typography
                sx={{
                  color: 'success.main'
                }}
              >ホームチームのアシスト者</Typography>
            </>}
            {homeTeamAssists.map((_, index) => (
              <TextField
                key={index}
                select
                label={`アシスト者${index+1}を選択`}
                value={homeTeamAssists[index].footballapi_player_id ?? ''}
                color="success"
                onChange={(e) => handleScorerChange( homeTeamSquads, homeTeamAssists, setHomeTeamAssists, index, e.target.value)}
                fullWidth
                margin="normal"
                error={errors.homeTeam}
                helperText={errors.homeTeam ? 'アシスト者を選択してください。' : ''}
              >
                {homeTeamSquads.map((player) => (
                  <MenuItem key={player.id} value={player.footballapi_player_id}>
                    {player.player_name}
                  </MenuItem>
                ))}
              </TextField>
            ))}
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
              onChange={(e) => handleTeamChange(e, setSelectedAwayTeam, setAwayTeamSquads)}
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
              onChange={(e) => handleScoreChange(e, setAwayTeamScore, setAwayTeamScorer)}
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
                select
                label={`得点者${index+1}を選択`}
                value={awayTeamScorer[index].footballapi_player_id ?? ''}
                color="success"
                onChange={(e) => handleScorerChange(awayTeamSquads, awayTeamScorer, setAwayTeamScorer,index, e.target.value)}
                fullWidth
                margin="normal"
                error={errors.homeTeam}
                helperText={errors.homeTeam ? 'ホームチームを選択してください。' : ''}
              >
                {awayTeamSquads.map((player) => (
                  <MenuItem key={player.id} value={player.footballapi_player_id}>
                    {player.player_name}
                  </MenuItem>
                ))}
              </TextField>
            ))}
            <Typography
              sx={{
                color: 'primary.main'
              }}
            >アウェイチームのアシスト数</Typography>
            <TextField
              type="number"
              value={awayTeamAssist}
              onChange={(e) => handleScoreChange(e, setAwayTeamAssist, setAwayTeamAssists)}
              color="primary"
              fullWidth
              margin="normal"
              error={errors.awayAssist}
              helperText={errors.awayAssist ? 'アウェイチームのアシスト数を入力してください。' : ''}
            />
            { (awayTeamAssists.length > 0) && <>
              <Typography
                sx={{
                  color: 'primary.main'
                }}
              >アウェイチームのアシスト者</Typography>
            </>}
            {awayTeamAssists.map((_, index) => (
              <TextField
                key={index}
                select
                label={`アシスト者${index+1}を選択`}
                value={awayTeamAssists[index].footballapi_player_id ?? ''}
                color="success"
                onChange={(e) => handleScorerChange(awayTeamSquads, awayTeamAssists, setAwayTeamAssists, index, e.target.value)}
                fullWidth
                margin="normal"
                error={!awayTeamAssists[index].footballapi_player_id}
                helperText={!awayTeamAssists[index].footballapi_player_id ? 'アシスト者を選択してください。' : ''}
              >
                {awayTeamSquads.map((player) => (
                  <MenuItem key={player.id} value={player.footballapi_player_id}>
                    {player.player_name}
                  </MenuItem>
                ))}
              </TextField>
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
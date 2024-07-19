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
  const [homeGoalOptions, setHomeGoalOptions] = useState<Squad[]>([]);
  const [awayTeamSquads, setAwayTeamSquads] = useState<Squad[]>([]);
  const [awayGoalOptions, setAwayGoalOptions] = useState<Squad[]>([]);
  const [homeTeamYellows, setHomeTeamYellows] = useState<number>();
  const [awayTeamYellows, setAwayTeamYellows] = useState<number>();
  const [homeTeamYellowCards, setHomeTeamYellowCards] = useState<Squad[]>([]);
  const [awayTeamYellowCards, setAwayTeamYellowCards] = useState<Squad[]>([]);
  const [homeTeamReds, setHomeTeamReds] = useState<number>();
  const [awayTeamReds, setAwayTeamReds] = useState<number>();
  const [homeTeamRedCards, setHomeTeamRedCards] = useState<Squad[]>([]);
  const [awayTeamRedCards, setAwayTeamRedCards] = useState<Squad[]>([]);
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
    setTeamSquads: React.Dispatch<React.SetStateAction<Squad[]>>,
    setGoalOptions?: React.Dispatch<React.SetStateAction<Squad[]>>
  ) => {
    const selectedTeam = teams.find(team => team.id === event.target.value);
    const res = await fetch(`/api/user/squads?user_id=${selectedTeam?.auth0_user_id}`, {method: 'GET'});
    const json = await res.json();
    setSelectedTeam(event.target.value);
    setTeamSquads(json.squads);

    console.log('handle team change', setGoalOptions);

    if (setGoalOptions) {
      console.log('set goal options');
      console.log([...json.squads, { footballapi_player_id: '0', name: 'オウンゴール' }])
      setGoalOptions([
        ...json.squads,
        {
          id: 'own_goal',
          footballapi_player_id: '0',
          footballapi_team_id: '0',
          player_name: 'オウンゴール',

        }
      ])
    }
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

  const handlePlayerChange = (
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
    } else if (value === '0'){
      console.log('own goal selected');
      const newScorers = [...scorers];
      newScorers[index] = {
        id: 'own_goal',
        footballapi_player_id: '0',
        footballapi_team_id: '0',
        player_name: 'オウンゴール',
        birth_date: '1998-01-01',
        nationality: 'JPN',
        height: '180 cm',
        weight: '100 kg'
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
          homeTeamYellowCards,
          awayTeamYellowCards,
          homeTeamRedCards,
          awayTeamRedCards,
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
      <Box sx={{
        margin: 3
      }}>
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
                onChange={(e) => handleTeamChange(e, setSelectedHomeTeam, setHomeTeamSquads, setHomeGoalOptions)}
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
                  onChange={(e) => handlePlayerChange( homeTeamSquads, homeTeamScorer, setHomeTeamScorer,index, e.target.value)}
                  fullWidth
                  margin="normal"
                  error={errors.homeTeam}
                  helperText={errors.homeTeam ? '得点者を選択してください。' : ''}
                >
                  {homeGoalOptions.map((player) => (
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
                  onChange={(e) => handlePlayerChange( homeTeamSquads, homeTeamAssists, setHomeTeamAssists, index, e.target.value)}
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
              <Typography
                sx={{
                  color: 'success.main'
                }}
              >ホームチームのイエローカード数</Typography>
              <TextField
                type="number"
                value={homeTeamYellows}
                onChange={(e) => handleScoreChange(e, setHomeTeamYellows, setHomeTeamYellowCards)}
                color="success"
                fullWidth
                margin="normal"
                // error={errors.homeAssist}
                // helperText={errors.homeAssist ? 'ホームチームのアシスト数を入力してください。' : ''}
              />
              { (homeTeamYellowCards.length > 0) && <>
                <Typography
                  sx={{
                    color: 'success.main'
                  }}
                >ホームチームのイエロ-カード</Typography>
              </>}
              {homeTeamYellowCards.map((_, index) => (
                <TextField
                  key={index}
                  select
                  label={`イエローカード選手${index+1}を選択`}
                  value={homeTeamYellowCards[index].footballapi_player_id ?? ''}
                  color="success"
                  onChange={(e) => handlePlayerChange(homeTeamSquads, homeTeamYellowCards, setHomeTeamYellowCards, index, e.target.value)}
                  fullWidth
                  margin="normal"
                  // error={errors.homeTeam}
                  // helperText={errors.homeTeam ? 'アシスト者を選択してください。' : ''}
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
              >ホームチームのレッドカード数</Typography>
              <TextField
                type="number"
                value={homeTeamReds}
                onChange={(e) => handleScoreChange(e, setHomeTeamReds, setHomeTeamRedCards)}
                color="success"
                fullWidth
                margin="normal"
                // error={errors.homeAssist}
                // helperText={errors.homeAssist ? 'ホームチームのアシスト数を入力してください。' : ''}
              />
              { (homeTeamRedCards.length > 0) && <>
                <Typography
                  sx={{
                    color: 'success.main'
                  }}
                >ホームチームのレッドカード</Typography>
              </>}
              {homeTeamRedCards.map((_, index) => (
                <TextField
                  key={index}
                  select
                  label={`レッドカード選手${index+1}を選択`}
                  value={homeTeamRedCards[index].footballapi_player_id ?? ''}
                  color="success"
                  onChange={(e) => handlePlayerChange(homeTeamSquads, homeTeamRedCards, setHomeTeamRedCards, index, e.target.value)}
                  fullWidth
                  margin="normal"
                  // error={errors.homeTeam}
                  // helperText={errors.homeTeam ? 'アシスト者を選択してください。' : ''}
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
                onChange={(e) => handleTeamChange(e, setSelectedAwayTeam, setAwayTeamSquads, setAwayGoalOptions)}
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
                  onChange={(e) => handlePlayerChange(awayTeamSquads, awayTeamScorer, setAwayTeamScorer,index, e.target.value)}
                  fullWidth
                  margin="normal"
                  error={errors.awayTeam}
                  helperText={errors.awayTeam ? 'アウェイチームの得点者を選択してください。' : ''}
                >
                  {awayGoalOptions.map((player) => (
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
                  onChange={(e) => handlePlayerChange(awayTeamSquads, awayTeamAssists, setAwayTeamAssists, index, e.target.value)}
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

              <Typography
                sx={{
                  color: 'primary.main'
                }}
              >アウェイチームのイエローカード数</Typography>
              <TextField
                type="number"
                value={awayTeamYellows}
                onChange={(e) => handleScoreChange(e, setAwayTeamYellows, setAwayTeamYellowCards)}
                color="primary"
                fullWidth
                margin="normal"
                // error={errors.homeAssist}
                // helperText={errors.homeAssist ? 'ホームチームのアシスト数を入力してください。' : ''}
              />
              { (awayTeamYellowCards.length > 0) && <>
                <Typography
                  sx={{
                    color: 'primary.main'
                  }}
                >アウェイチームのイエロ-カード</Typography>
              </>}
              {awayTeamYellowCards.map((_, index) => (
                <TextField
                  key={index}
                  select
                  label={`イエローカード選手${index+1}を選択`}
                  value={awayTeamYellowCards[index].footballapi_player_id ?? ''}
                  color="primary"
                  onChange={(e) => handlePlayerChange(awayTeamSquads, awayTeamYellowCards, setAwayTeamYellowCards, index, e.target.value)}
                  fullWidth
                  margin="normal"
                  // error={errors.homeTeam}
                  // helperText={errors.homeTeam ? 'アシスト者を選択してください。' : ''}
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
              >アウェイチームのレッドカード数</Typography>
              <TextField
                type="number"
                value={awayTeamReds}
                onChange={(e) => handleScoreChange(e, setAwayTeamReds, setAwayTeamRedCards)}
                color="primary"
                fullWidth
                margin="normal"
                // error={errors.homeAssist}
                // helperText={errors.homeAssist ? 'ホームチームのアシスト数を入力してください。' : ''}
              />
              { (awayTeamRedCards.length > 0) && <>
                <Typography
                  sx={{
                    color: 'primary.main'
                  }}
                >アウェイチームのレッドカード</Typography>
              </>}
              {awayTeamRedCards.map((_, index) => (
                <TextField
                  key={index}
                  select
                  label={`レッドカード選手${index+1}を選択`}
                  value={awayTeamRedCards[index].footballapi_player_id ?? ''}
                  color="primary"
                  onChange={(e) => handlePlayerChange(awayTeamSquads, awayTeamRedCards, setAwayTeamRedCards, index, e.target.value)}
                  fullWidth
                  margin="normal"
                  // error={errors.homeTeam}
                  // helperText={errors.homeTeam ? 'アシスト者を選択してください。' : ''}
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
      </Box>
    </>
  )
};

export default GameAdd;
import { OrgUser } from "@/types/OrgUser.ts";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ConventionAdd = () => {

  const router = useRouter();
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [convention_name, setConventionName] = useState<string>('');
  const [held_day, setHeldDay] = useState<string>('');
  const [teams, setTeams] = useState([{ team_name: '', manager_name: '', auth0_user_id: '' }]);
  const [errors, setErrors] = useState<{
    conventionName: boolean,
    heldDate: boolean,
    teams: boolean
  }>({
    conventionName: false,
    heldDate: false,
    teams: false
  });

  useEffect(() => {

    const fetchOrgUser = async () => {
      const res = await fetch('/api/org/members');
      const json = await res.json();
      console.log(json);
      setOrgUsers(json);
    }
    fetchOrgUser();
  }, []);

  const handleAddTeam = () => {
    setTeams([...teams, { team_name: '', manager_name: '', auth0_user_id: '' }]);
  };

  const handleTeamChange = (index: number, field: string, value: string) => {
    const newTeams = teams.map((team, i) => 
      i === index ? { ...team, [field]: value } : team
    );
    setTeams(newTeams);
  };
  const validateForm = () => {
    const errors = {
      conventionName: !convention_name,
      heldDate: !held_day,
      teams: teams.some(s => !s) 
    }
    setErrors(errors);

    return !Object.values(errors).some(isError => isError);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    console.log({
      convention_name,
      held_day,
      teams
    });

    try {
      const response = await fetch(`/api/convention`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          convention_name,
          held_day,
          teams
        })
      });
      const result = await response.json();
      console.log(result);

      if (result.result.success) {
        router.push('/conventions');
      } else {
        console.error('error');
      }

    } catch (error) {
      console.error('Faild to submit game result: ', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography>大会名</Typography>
        <TextField
          type="text"
          label="大会名"
          value={convention_name}
          onChange={(e) => setConventionName(e.target.value)}
          fullWidth
          margin="normal"
          error={errors.conventionName}
          helperText={errors.conventionName ? '大会名を入力してください。': ''}
        />
        <Typography>開催日</Typography>
        <TextField
          fullWidth
          type="date"
          margin="normal"
          onChange={ e => setHeldDay(e.target.value)}
          error={errors.heldDate}
          helperText={errors.heldDate ? '開催日を入力してください。': ''}
        />
        {teams.map((team, index) => (
          <Box key={index}>
            <Typography>チーム{index+1}</Typography>
            <TextField
              label="チーム名"
              value={team.team_name}
              onChange={(e) => handleTeamChange(index, 'team_name', e.target.value)}
              fullWidth
              margin="normal"
              error={teams[index]['team_name'] === ''}
              helperText={teams[index]['team_name'] === ''? 'チーム名を入力してください。': ''}
            />
            <TextField
              label="マネージャー名"
              value={team.manager_name}
              onChange={(e) => handleTeamChange(index, 'manager_name', e.target.value)}
              fullWidth
              margin="normal"
              error={teams[index]['manager_name'] === ''}
              helperText={teams[index]['manager_name'] === ''? '監督名を入力してください。': ''}
            />
            <TextField
              select
              label="ユーザーを選択"
              value={team.auth0_user_id}
              onChange={(e) => handleTeamChange(index, 'auth0_user_id', e.target.value)}
              margin="normal"
              fullWidth
              error={teams[index]['auth0_user_id'] === ''}
              helperText={teams[index]['auth0_user_id'] === ''? '監督名を入力してください。': ''}
            >
              {orgUsers.map((user) => (
                <MenuItem key={user.auth0_user_id} value={user.auth0_user_id}>
                  {user.nickname}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        ))}
        <Button onClick={handleAddTeam}>チームを追加</Button>
        <Button type="submit" variant="contained" color="primary">
          大会を登録
        </Button>
      </form>
    </>
  )
};

export default ConventionAdd;
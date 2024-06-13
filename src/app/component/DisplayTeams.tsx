import { Team } from "@/types/Team";
import { Card, CardContent, List, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

type Props = {
  id: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: '順位', width: 70},
  { field: 'teamName', headerName: 'クラブ', width: 150 },
  { field: 'games', headerName: '試合数', type: 'number', width: 70 },
  { field: 'wins', headerName: '勝', type: 'number', width: 70 },
  { field: 'draw', headerName: '引', type: 'number', width: 70 },
  { field: 'lose', headerName: '負', type: 'number', width: 70 },
  { field: 'totalScore', headerName: '得点', type: 'number', width: 70 },
  { field: 'concededPoints', headerName: '失点', type: 'number', width: 70 },
  { field: 'diff', headerName: '得失点', type: 'number', width: 70 },
  { field: 'winPoints', headerName: '勝点', type: 'number', width: 70 },
];

const DisplayTeams = ({id}: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);

  // チーム一覧の取得
  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch(`/api/convention/${id}/teams`);
      const json = await res.json();
      setTeams(json.data);
    }

    fetchTeams();
  }, [id]);
  // 順位表に表示するデータを整えて、リストに追加する
  const rankingList = teams?.map(team => ({
    teamName: team.team_name,
    games: team.games,
    wins: team.win,
    draw: team.draw,
    lose: team.lose,
    totalScore: team.totalScore,
    concededPoints: team.concededPoints,
    diff: team.totalScore - team.concededPoints,
    winPoints: (team.win * 3) + team.draw,
  }));

  // 勝ち点でソートする
  rankingList.sort((a, b) => b.winPoints - a.winPoints);

  // ソートされたリストに順位を付与する
  const rankedTeams = rankingList.map((team, index) => ({
    ...team,
    id: index + 1  // 1から始まる順位
  }));

  return (
    <>
      {/* <DataGrid
        rows={rankedTeams}
        columns={columns}
      /> */}
      <Card>
        <CardContent>
          <List>
            <Grid2 container spacing={2}>
              <Grid2 xs={1}>
                <Typography variant="body2">順位</Typography>
              </Grid2>
              <Grid2 xs={2}>
                <Typography variant="body2">クラブ</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">試合数</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">勝</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">引</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">負</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">得点</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">失点</Typography>
              </Grid2>
              <Grid2 xs={2}>
                <Typography variant="body2">得失点差</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">勝点</Typography>
              </Grid2>
              {rankedTeams.map(( team, index) => (
                <ListItem
                  key={index}
                  disableGutters
                >
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.id}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <Typography variant="body2">{team.teamName}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.games}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.wins}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.draw}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.lose}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.totalScore}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.concededPoints}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <Typography variant="body2">{team.diff}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.winPoints}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
        </CardContent>
      </Card>
    </>
  )
};

export default DisplayTeams;
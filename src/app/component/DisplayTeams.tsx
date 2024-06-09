import { Team } from "@/types/Team";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {
  teams: Team[]
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

const DisplayTeams = ({ teams }: Props) => {

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
      <DataGrid
        rows={rankedTeams}
        columns={columns}
      />
    </>
  )
};

export default DisplayTeams;
import { Team } from "@/types/Team";
import { Card, CardContent, List, Link as MuiLink, ListItem, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type Props = {
  id: string
}

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
    team_id: team.id
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
                      <MuiLink
                        component={NextLink}
                        underline="none"
                        color={'black'}
                        href={`/conventions/${id}/team/${team.team_id}`}
                        sx={{
                          '&:hover': {
                            color: 'blue',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        <Typography variant="body2">{team.teamName}</Typography>
                      </MuiLink>
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
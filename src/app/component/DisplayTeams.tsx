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
    plusMinus: `${team.totalScore}-${team.concededPoints}`,
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
                <Typography variant="body2">#</Typography>
              </Grid2>
              <Grid2 xs={3}>
                <Typography variant="body2"></Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">PL</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">W</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">D</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">L</Typography>
              </Grid2>
              <Grid2 xs={2}>
                <Typography variant="body2">+/-</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">GD</Typography>
              </Grid2>
              <Grid2 xs={1}>
                <Typography variant="body2">PTS</Typography>
              </Grid2>
              {rankedTeams.map(( team, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    borderRadius: 1,
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      boxShadow: 1,
                      transform: "translateY(-1px)"
                    }
                  }}
                >
                    <Grid2 xs={1}>
                      <Typography variant="body2">{team.id}</Typography>
                    </Grid2>
                    <Grid2 xs={3}>
                      <MuiLink
                        component={NextLink}
                        underline="none"
                        color={'black'}
                        href={`/conventions/${id}/team/${team.team_id}`}
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
                    <Grid2 xs={2}>
                      <Typography variant="body2">{team.plusMinus}</Typography>
                    </Grid2>
                    <Grid2 xs={1}>
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
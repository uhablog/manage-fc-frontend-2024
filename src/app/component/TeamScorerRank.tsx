import { Scorer } from "@/types/Scorer";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  team_id: string
}
export const TeamScorerRank = ({team_id}: Props) => {

  const [ teamScorer, setTeamScorer ] = useState<Scorer[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');

  useEffect(() => {
    const fetchTeamScorer = async () => {
      const res = await fetch(`/api/team/scorer?team_id=${team_id}`);
      const json = await res.json();
      if (json.success) {
        setTeamScorer(json.data);
      } else {
        window.alert('チーム内得点王の取得に失敗しました');
      }
    };
    fetchTeamScorer();
  }, [team_id]);

  const onClose = () => { setOpen(false) };
  const handleClick = (player_id: string) => {
    setSelectedPlayer(player_id);
    setOpen(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography>チーム得点ランク</Typography>
          <List>
            {teamScorer?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
                onClick={() => handleClick(player.footballapi_player_id)}
              >
                <ListItemAvatar>
                  <Avatar alt={`team scorer ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}/>
                </ListItemAvatar>
                <ListItemText primary={`${player.scorer_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={team_id}
        player_id={selectedPlayer}
      />
    </>
  )
};
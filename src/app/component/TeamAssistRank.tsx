import { Assist } from "@/types/Assist";
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  team_id: string
}

export const TeamAssistRank = ({team_id}: Props) => {
  const [ teamAssist, setTeamAssist] = useState<Assist[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');

  useEffect(() => {
    const fetchTeamAssist = async () => {
      const res = await fetch(`/api/team/assist?team_id=${team_id}`);
      const json = await res.json();
      if (json.success) {
        setTeamAssist(json.data);
      } else {
        window.alert('チーム内アシストランクの取得に失敗しました。');
      }
    };
    fetchTeamAssist();
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
          <Typography>チームアシストランク</Typography>
          <List>
            {teamAssist?.map((player, index) => (
              <ListItem
                key={index}
                secondaryAction={player.score}
                onClick={() => handleClick(player.footballapi_player_id)}
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
                <ListItemAvatar>
                  <Avatar alt={`team scorer ${index+1}`} src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}/>
                </ListItemAvatar>
                <ListItemText primary={`${player.assist_name}`} />
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
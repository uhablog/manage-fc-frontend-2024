import { Avatar, Button, Card, CardContent, Link as MuiLink, List, ListItem, ListItemAvatar, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { PlayerStatsDialog } from "./PlayerStatsDialog";
import { RedCards } from "@/types/RedCards";

type Props = {
  id: string
  initialLimit?: number
}

const DisplayRedCardRank = ({id, initialLimit}: Props) => {

  const [cards, setCards] = useState<RedCards[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState<string>('');
  const [ selectedTeamId, setSelectedTeamId ] = useState<string>('');

  // カードランクの取得
  useEffect(() => {
    const fetchRedCardRank = async () => {
      const res = await fetch(`/api/convention/${id}/redcard`);
      const json = await res.json();
      setCards(json);
    };
    fetchRedCardRank();
  }, [id]);

  const showAllCards = () => {
    setLimit(undefined);  // 'すべて表示'をクリックしたらlimitを解除
  };

  const hideLimit = () => {
    if (initialLimit) {
      setLimit(initialLimit);
    } else {
      setLimit(5);
    }
  }

  const onClose = () => { setOpen(false) };
  const handleClick = (player_id: string, team_id: string) => {
    setSelectedPlayer(player_id);
    setSelectedTeamId(team_id);
    setOpen(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="p">Red Cards</Typography>
          <List>
            <Grid2 container spacing={2}>
              {(limit ? cards.slice(0, limit) : cards).map((card, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  onClick={() => handleClick(card.footballapi_player_id, card.team_id)}
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
                      <Typography variant="body2">{card.rank}</Typography>
                    </Grid2>
                    <Grid2 xs={2}>
                      <ListItemAvatar>
                        <Avatar alt={`scorer rank ${index+1}`} src={`https://media.api-sports.io/football/players/${card.footballapi_player_id}.png`} />
                      </ListItemAvatar>
                    </Grid2>
                    <Grid2 xs={8}>
                      <Typography
                        component="p"
                        sx={{
                          fontWeight: "bold"
                        }}
                      >{card.player_name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={card.emblem_url ?? undefined}
                          alt={`${card.team_name} emblem`}
                          sx={{ width: 20, height: 20 }}
                        >
                          {card.team_name?.charAt(0) ?? "?"}
                        </Avatar>
                        <MuiLink
                          component={NextLink}
                          underline="none"
                          color={'black'}
                          href={`/conventions/${id}/team/${card.team_id}`}
                          sx={{
                            '&:hover': {
                              color: 'blue',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          <Typography variant="body2">{card.team_name}</Typography>
                        </MuiLink>
                      </Stack>
                    </Grid2>
                    <Grid2 xs={1}>
                      <Typography>{card.score}</Typography>
                    </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {
            limit === undefined ?
            <Button onClick={hideLimit}>部分的に表示</Button>
            :
            <Button onClick={showAllCards}>すべて表示</Button>
          }
        </CardContent>
      </Card>
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={selectedTeamId}
        player_id={selectedPlayer}
      />
    </>
  )
};

export default DisplayRedCardRank;

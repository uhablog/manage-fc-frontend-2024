import { Game } from "@/types/Game";
import { Star } from "@mui/icons-material";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  game: Game | undefined
}
const GameMomCard = ({
  game
}: Props) => {

  const [ open, setOpen ] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 xs={1}>
              <Star fontSize="small"/>
            </Grid2>
            <Grid2 xs={2} md={1}>
              <Typography component="p">
                MOM
              </Typography>
            </Grid2>
            <Grid2 xs={2} md={1}>
              <Avatar
                alt={`mom game ${game?.game_id}`}
                src={`https://media.api-sports.io/football/players/${game?.mom_footballapi_player_id}.png`}
                onClick={() => setOpen(true)}
              />
            </Grid2>
            <Grid2 xs={4} md={1}>
              <Typography
                component="p"
                onClick={() => setOpen(true)}
              >
                {game?.mom}
              </Typography>
            </Grid2>
            <Grid2 xs={3}>
              {
                game?.home_team_id === game?.mom_team_id ?
                <>
                  <Typography>
                    {game?.home_team_name}
                  </Typography>
                </>
                :
                <>
                  <Typography>
                    {game?.away_team_name}
                  </Typography>
                </>
              }
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        team_id={game?.mom_team_id ? game.mom_team_id: ''}
        player_id={game?.mom_footballapi_player_id ? game.mom_footballapi_player_id: ''}
      />
    </>
  )
}

export default GameMomCard;
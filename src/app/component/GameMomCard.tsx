import { Game } from "@/types/Game";
import { Star } from "@mui/icons-material";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  game: Game | undefined
}
const GameMomCard = ({
  game
}: Props) => {
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
              <Avatar alt={`mom game ${game?.game_id}`} src={`https://media.api-sports.io/football/players/${game?.mom_footballapi_player_id}.png`}/>
            </Grid2>
            <Grid2 xs={4} md={1}>
              <Typography component="p">
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
    </>
  )
}

export default GameMomCard;
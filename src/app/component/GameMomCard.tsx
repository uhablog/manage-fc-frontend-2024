import { Game } from "@/types/Game";
import { Star } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
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
            <Grid2 xs={2}>
              <Star fontSize="large" />
            </Grid2>
            <Grid2 xs={10}>
              <Typography variant="h5" component="p">
                MOM: {game?.mom}
              </Typography>
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
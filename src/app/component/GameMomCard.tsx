import { Game } from "@/types/Game";
import { Star } from "@mui/icons-material";
import { Avatar, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
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
  const momRatingRaw = game?.mom_rating;
  const momRatingValue =
    momRatingRaw === null || momRatingRaw === undefined ? null : Number(momRatingRaw);
  const hasMomRating = typeof momRatingValue === "number" && !Number.isNaN(momRatingValue);

  const onClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 3
            }}
          >Player of the Match</Typography>
          <Grid2 container spacing={2}>
            <Grid2 xs={2} md={1}>
              <Avatar
                alt={`mom game ${game?.game_id}`}
                src={`https://media.api-sports.io/football/players/${game?.mom_footballapi_player_id}.png`}
                onClick={() => setOpen(true)}
              />
            </Grid2>
            <Grid2 xs={4} md={2}>
              <Typography
                component="p"
                onClick={() => setOpen(true)}
                sx={{
                  fontWeight: "bold"
                }}
              >
                {game?.mom}
              </Typography>
              {
                game?.home_team_id === game?.mom_team_id ?
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={game?.home_team_emblem_url ?? undefined}
                      alt={`${game?.home_team_name} emblem`}
                      sx={{ width: 24, height: 24 }}
                    >
                      {game?.home_team_name?.charAt(0) ?? "?"}
                    </Avatar>
                    <Typography variant="body1" component="p" textAlign="left">
                      {game?.home_team_name}
                    </Typography>
                  </Stack>
                </>
                :
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={game?.away_team_emblem_url ?? undefined}
                      alt={`${game?.away_team_name} emblem`}
                      sx={{ width: 24, height: 24 }}
                    >
                      {game?.away_team_name?.charAt(0) ?? "?"}
                    </Avatar>
                    <Typography variant="body1" component="p" textAlign="left">
                      {game?.away_team_name}
                    </Typography>
                  </Stack>
                </>
              }
            </Grid2>
            <Grid2 xs>
              {hasMomRating && (
                <Stack alignItems="flex-end" justifyContent="center" sx={{ height: "100%" }}>
                  <Chip
                    label={
                      <Stack direction="row" alignItems="center">
                        <Typography fontWeight="bold" color="inherit">
                          {momRatingValue!.toFixed(1)}
                        </Typography>
                        <Star fontSize="small" sx={{ ml: 0.5 }} />
                      </Stack>
                    }
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      fontWeight: "bold",
                      "& .MuiChip-label": {
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Stack>
              )}
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

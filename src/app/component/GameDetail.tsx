import { Game } from "@/types/Game"
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  game: Game | null
  open: boolean
  onClose: () => void
}

const GameDetail = ({ game, open, onClose }: Props) => {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>試合詳細</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Typography variant="h6" component="p">
              {game?.home_team_name}
              {game?.home_team_score}
            </Typography>
            <Typography variant="body1" component="p">
              得点者:
              {game?.home_team_scorer.map((scorer, index) => (
                <Typography key={index} variant="body2">{scorer}</Typography>
              ))}
            </Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography variant="h6" component="p">
              {game?.away_team_name}
              {game?.away_team_score}
            </Typography>
            <Typography variant="body1" component="p">
              得点者:
              {game?.away_team_scorer.map((scorer, index) => (
                <Typography key={index} variant="body2">{scorer}</Typography>
              ))}
            </Typography>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  )
};

export default GameDetail;
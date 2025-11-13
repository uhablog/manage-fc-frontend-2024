import { Autocomplete, Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { PlayerOption } from "@/types/PlayerOption";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { SnackbarState } from "@/types/SnackbarState";
import { ResultFormState } from "@/types/ResultFormState";
import { Game } from "@/types/Game";

type ResultFormErrors = Partial<{
  momPlayer: string;
  momRating: string;
  confirmed: string;
}>;

export default function GameResultConfirm({
  game,
  homePlayers,
  awayPlayers,
  setSnackbar,
  resultForm,
  setResultForm,
}: {
  game: Game
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  resultForm: ResultFormState;
  setResultForm: Dispatch<SetStateAction<ResultFormState>>;
}) {

  const [resultErrors, setResultErrors] = useState<ResultFormErrors>({});
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const momOptions = useMemo(
    () => (resultForm.momSide === "HOME" ? homePlayers : awayPlayers),
    [resultForm.momSide, homePlayers, awayPlayers],
  );

  const handleResultSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: ResultFormErrors = {};

    if (!resultForm.momPlayer) {
      errors.momPlayer = "MOMを選択してください。";
    }
    if (resultForm.momRating === null || Number.isNaN(resultForm.momRating)) {
      errors.momRating = "MOMの評価点を入力してください。";
    } else if (resultForm.momRating < 0 || resultForm.momRating > 10) {
      errors.momRating = "0〜10の範囲で入力してください。";
    }
    if (!resultForm.confirmed) {
      errors.confirmed = "確定前に内容を確認してください。";
    }

    setResultErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setConfirmOpen(true);
  };

  const handleResultFinalize = async () => {

    const momTeamId = resultForm.momSide === "HOME" ? game.home_team_id : game.away_team_id;
    try {
      const response = await fetch(`/api/game/v2/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          momTeam: momTeamId,
          mom: {
            player_name: resultForm.momPlayer?.label,
            footballapi_player_id: resultForm.momPlayer?.value,
            rating: resultForm.momRating,
          },
          game_id: game.game_id
        })
      });

      if (response.ok) {
        setConfirmOpen(false);
        setResultForm((prev) => ({
          ...prev,
          confirmed: false,
          momRating: null,
        }));
        setSnackbar({
          open: true,
          message: "試合結果を確定しました",
          severity: "success",
        });
        window.location.reload();
      } else {
        window.alert('試合結果の確定に失敗');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack component="form" spacing={2} onSubmit={handleResultSubmit}>
                <Typography variant="h6">試合結果の確定</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">{game.home_team_score} - {game.away_team_score}</Typography>
                </Stack>
                <ToggleButtonGroup
                  value={resultForm.momSide}
                  exclusive
                  fullWidth
                  onChange={(_, value) => {
                    if (!value) return;
                    setResultForm((prev) => ({
                      ...prev,
                      momSide: value,
                      momPlayer: null,
                    }));
                    setResultErrors((prev) => ({ ...prev, momPlayer: undefined }));
                  }}
                >
                  <ToggleButton value="HOME">{game.home_team_name}</ToggleButton>
                  <ToggleButton value="AWAY">{game.away_team_name}</ToggleButton>
                </ToggleButtonGroup>
                <Autocomplete
                  value={resultForm.momPlayer}
                  onChange={(_, value) => {
                    setResultForm((prev) => ({
                      ...prev,
                      momPlayer: value,
                    }));
                    setResultErrors((prev) => ({ ...prev, momPlayer: undefined }));
                  }}
                  options={momOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="MOM"
                      error={Boolean(resultErrors.momPlayer)}
                      helperText={resultErrors.momPlayer}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  disabled={momOptions.length === 0}
                />
                <TextField
                  label="MOM評価点"
                  type="number"
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  value={resultForm.momRating ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    const numericValue = value === "" ? null : Number(value);
                    if (numericValue === null || !Number.isNaN(numericValue)) {
                      setResultForm((prev) => ({
                        ...prev,
                        momRating: numericValue,
                      }));
                      setResultErrors((prev) => ({ ...prev, momRating: undefined }));
                    }
                  }}
                  error={Boolean(resultErrors.momRating)}
                  helperText={resultErrors.momRating}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={resultForm.confirmed}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setResultForm((prev) => ({
                          ...prev,
                          confirmed: checked,
                        }));
                        setResultErrors((prev) => ({ ...prev, confirmed: undefined }));
                      }}
                    />
                  }
                  label="入力内容を確認しました"
                />
                {resultErrors.confirmed && (
                  <Typography variant="caption" color="error">
                    {resultErrors.confirmed}
                  </Typography>
                )}
                <Stack direction="row" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="warning">
                    試合結果を確定
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>試合結果を確定します</DialogTitle>
        <DialogContent>
          <DialogContentText>確定後は得点・カードの登録はできません</DialogContentText>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {game.home_team_name} {game.home_team_score} - {game.away_team_score} {game.away_team_name}
          </Typography>
          {resultForm.momPlayer && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              MOM: {resultForm.momPlayer.label}
            </Typography>
          )}
          {resultForm.momRating !== null && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              MOM評価点: {resultForm.momRating}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button onClick={handleResultFinalize} variant="contained" color="warning">
            更新する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

import { Autocomplete, Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ResultPreviewCard } from "./ResultPreviewCard";
import { PlayerOption } from "@/types/PlayerOption";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { SnackbarState } from "@/types/SnackbarState";
import { ResultPreview } from "@/types/ResultPreview";
import { ResultFormState } from "@/types/ResultFormState";

type ResultFormErrors = Partial<{
  homeScore: string;
  awayScore: string;
  momPlayer: string;
  confirmed: string;
}>;

export default function GameResultConfirm({
  homeTeamName,
  awayTeamName,
  homePlayers,
  awayPlayers,
  setSnackbar,
  preview,
  resultForm,
  setResultForm,
  setResultPreview
}: {
  homeTeamName: string;
  awayTeamName: string;
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  preview: ResultPreview;
  resultForm: ResultFormState;
  setResultForm: Dispatch<SetStateAction<ResultFormState>>;
  setResultPreview: Dispatch<SetStateAction<ResultPreview>>;
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
    const homeScoreValue = Number(resultForm.homeScore);
    const awayScoreValue = Number(resultForm.awayScore);

    if (Number.isNaN(homeScoreValue) || homeScoreValue < 0) {
      errors.homeScore = "0以上の数字を入力してください。";
    }
    if (Number.isNaN(awayScoreValue) || awayScoreValue < 0) {
      errors.awayScore = "0以上の数字を入力してください。";
    }
    if (!resultForm.momPlayer) {
      errors.momPlayer = "MOMを選択してください。";
    }
    if (!resultForm.confirmed) {
      errors.confirmed = "確定前に内容を確認してください。";
    }

    setResultErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setConfirmOpen(true);
  };

  const handleResultFinalize = () => {
    setResultPreview({
      homeScore: Number(resultForm.homeScore),
      awayScore: Number(resultForm.awayScore),
      momName: resultForm.momPlayer?.label ?? "",
      momSide: resultForm.momSide,
    });
    setConfirmOpen(false);
    setResultForm((prev) => ({
      ...prev,
      confirmed: false,
    }));
    setSnackbar({
      open: true,
      message: "試合結果プレビューを更新しました（API未接続）。",
      severity: "success",
    });
  };

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack component="form" spacing={2} onSubmit={handleResultSubmit}>
                <Typography variant="h6">試合結果の確定（デザインのみ）</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label={homeTeamName}
                    type="number"
                    value={resultForm.homeScore}
                    onChange={(event) => {
                      const value = event.target.value;
                      setResultForm((prev) => ({
                        ...prev,
                        homeScore: value,
                      }));
                      setResultErrors((prev) => ({ ...prev, homeScore: undefined }));
                    }}
                    error={Boolean(resultErrors.homeScore)}
                    helperText={resultErrors.homeScore}
                    inputProps={{ min: 0 }}
                  />
                  <Typography variant="h6">-</Typography>
                  <TextField
                    label={awayTeamName}
                    type="number"
                    value={resultForm.awayScore}
                    onChange={(event) => {
                      const value = event.target.value;
                      setResultForm((prev) => ({
                        ...prev,
                        awayScore: value,
                      }));
                      setResultErrors((prev) => ({ ...prev, awayScore: undefined }));
                    }}
                    error={Boolean(resultErrors.awayScore)}
                    helperText={resultErrors.awayScore}
                    inputProps={{ min: 0 }}
                  />
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
                  <ToggleButton value="HOME">{homeTeamName}</ToggleButton>
                  <ToggleButton value="AWAY">{awayTeamName}</ToggleButton>
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
                  label="試合備考（任意）"
                  value={resultForm.note}
                  onChange={(event) =>
                    setResultForm((prev) => ({
                      ...prev,
                      note: event.target.value,
                    }))
                  }
                  multiline
                  minRows={3}
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
        <Grid2 xs={12} md={6}>
          <ResultPreviewCard
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            preview={preview}
            note={resultForm.note}
          />
        </Grid2>
      </Grid2>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>試合結果のプレビューを更新しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作はデザイン確認用です。API連携は行われません。
          </DialogContentText>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {homeTeamName} {resultForm.homeScore} - {resultForm.awayScore} {awayTeamName}
          </Typography>
          {resultForm.momPlayer && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              MOM: {resultForm.momPlayer.label}
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
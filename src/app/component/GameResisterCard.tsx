import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { Autocomplete, Button, Card, CardContent, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { CardTimeline } from "./CardTimeline";

type CardFormState = {
  side: TeamSide;
  minute: string;
  player: PlayerOption | null;
  cardType: "YELLOW" | "RED";
  note: string;
};

type CardFormErrors = Partial<{
  minute: string;
  player: string;
}>;

export default function GameResisterCard({
  homeTeamName,
  awayTeamName,
  homePlayers,
  awayPlayers,
  setSnackbar
}: {
  homeTeamName: string;
  awayTeamName: string;
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
}) {

  const [cardForm, setCardForm] = useState<CardFormState>({
    side: "HOME",
    minute: "",
    player: null,
    cardType: "YELLOW",
    note: "",
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [cardEvents, setCardEvents] = useState<CardTimelineEvent[]>([]);

  const cardPlayerOptions = useMemo(
    () => (cardForm.side === "HOME" ? homePlayers : awayPlayers),
    [cardForm.side, homePlayers, awayPlayers],
  );

  const handleCardSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: CardFormErrors = {};
    const minuteValue = Number(cardForm.minute);
    if (Number.isNaN(minuteValue) || minuteValue < 0) {
      errors.minute = "0以上の分を入力してください。";
    }
    if (!cardForm.player) {
      errors.player = "対象選手を選択してください。";
    }

    setCardErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newEvent: CardTimelineEvent = {
      id: `card-${Date.now()}`,
      minute: minuteValue,
      side: cardForm.side,
      player: cardForm.player!,
      cardType: cardForm.cardType,
      note: cardForm.note ? cardForm.note : undefined,
    };

    setCardEvents((prev) => [...prev, newEvent].sort((a, b) => a.minute - b.minute));
    setCardForm((prev) => ({
      ...prev,
      minute: "",
      player: null,
      note: "",
    }));
    setCardErrors({});
    setSnackbar({
      open: true,
      message: "カードイベントを追加しました（API未接続）。",
      severity: "success",
    });
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleCardSubmit}>
              <Typography variant="h6">カードの登録（デザインのみ）</Typography>
              <ToggleButtonGroup
                value={cardForm.side}
                exclusive
                fullWidth
                onChange={(_, value) => {
                  if (!value) return;
                  setCardForm({
                    side: value,
                    minute: "",
                    player: null,
                    cardType: cardForm.cardType,
                    note: "",
                  });
                  setCardErrors({});
                }}
              >
                <ToggleButton value="HOME">{homeTeamName}</ToggleButton>
                <ToggleButton value="AWAY">{awayTeamName}</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                value={cardForm.cardType}
                exclusive
                fullWidth
                onChange={(_, value) => {
                  if (!value) return;
                  setCardForm((prev) => ({
                    ...prev,
                    cardType: value,
                  }));
                }}
              >
                <ToggleButton value="YELLOW">イエロー</ToggleButton>
                <ToggleButton value="RED">レッド</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                label="時間（分）"
                type="number"
                value={cardForm.minute}
                onChange={(event) => {
                  const value = event.target.value;
                  setCardForm((prev) => ({
                    ...prev,
                    minute: value,
                  }));
                  setCardErrors((prev) => ({ ...prev, minute: undefined }));
                }}
                error={Boolean(cardErrors.minute)}
                helperText={cardErrors.minute}
                inputProps={{ min: 0 }}
              />
              <Autocomplete
                value={cardForm.player}
                onChange={(_, value) => {
                  setCardForm((prev) => ({
                    ...prev,
                    player: value,
                  }));
                  setCardErrors((prev) => ({ ...prev, player: undefined }));
                }}
                options={cardPlayerOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="対象選手"
                    error={Boolean(cardErrors.player)}
                    helperText={cardErrors.player}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
              />
              <TextField
                label="備考（任意）"
                placeholder="例: 2枚目"
                value={cardForm.note}
                onChange={(event) =>
                  setCardForm((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                multiline
                minRows={2}
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  カードを追加
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              登録済みのカードイベント
            </Typography>
            <CardTimeline
              events={cardEvents}
              homeTeamName={homeTeamName}
              awayTeamName={awayTeamName}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
}; 
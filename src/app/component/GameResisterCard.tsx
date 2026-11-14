import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { CardTimeline } from "./CardTimeline";
import { Game } from "@/types/Game";

type CardFormState = {
  side: TeamSide;
  minute: string;
  player: PlayerOption | null;
  cardType: "YELLOW" | "RED";
};

type CardFormErrors = Partial<{
  minute: string;
  player: string;
}>;

type Props = {
  game: Game;
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  cardEvents: CardTimelineEvent[];
  onEventChanged: () => Promise<void>;
};

export default function GameResisterCard({
  game,
  homePlayers,
  awayPlayers,
  setSnackbar,
  cardEvents,
  onEventChanged,
}: Props) {
  const [cardForm, setCardForm] = useState<CardFormState>({
    side: "HOME",
    minute: "",
    player: null,
    cardType: "YELLOW",
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [editingEvent, setEditingEvent] = useState<CardTimelineEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cardPlayerOptions = useMemo(
    () => (cardForm.side === "HOME" ? homePlayers : awayPlayers),
    [cardForm.side, homePlayers, awayPlayers],
  );

  const resetForm = (side: TeamSide = cardForm.side) => {
    setCardForm({ side, minute: "", player: null, cardType: "YELLOW" });
    setCardErrors({});
    setEditingEvent(null);
  };

  const startEditing = (event: CardTimelineEvent) => {
    setCardForm({
      side: event.side,
      minute: String(event.minute),
      player: event.player,
      cardType: event.cardType,
    });
    setCardErrors({});
    setEditingEvent(event);
  };

  const handleCardSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const errors: CardFormErrors = {};
    const minuteValue = Number(cardForm.minute);
    if (Number.isNaN(minuteValue) || minuteValue < 0) {
      errors.minute = "0以上の分を入力してください。";
    }
    if (Number.isNaN(minuteValue) || minuteValue > 150) {
      errors.minute = "150以下の分を入力してください。";
    }
    if (!cardForm.player) {
      errors.player = "対象選手を選択してください。";
    }

    setCardErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        editingEvent ? `/api/game/v2/card/${editingEvent.id}` : `/api/game/v2/card`,
        {
        method: editingEvent ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: game.game_id,
          card_info: {
            player_name: cardForm.player?.label,
            footballapi_player_id: cardForm.player?.value,
          },
          team_id: cardForm.side === "HOME" ? game.home_team_id : game.away_team_id,
          minute: cardForm.minute,
          card_type: cardForm.cardType,
        }),
        },
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        await onEventChanged();
        const wasEditing = Boolean(editingEvent);
        resetForm(cardForm.side);
        setSnackbar({
          open: true,
          message: wasEditing ? "カードイベントを更新しました" : "カードイベントを追加しました",
          severity: "success",
        });
      } else {
        throw new Error(data?.message ?? "カードイベントの保存に失敗しました。");
      }
    } catch (error) {
      console.error("Failed to submit card event", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "カードイベントの保存に失敗しました。",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleCardSubmit}>
              <Typography variant="h6">{editingEvent ? "カードの編集" : "カードの登録"}</Typography>
              <ToggleButtonGroup
                value={cardForm.side}
                exclusive
                fullWidth
                onChange={(_, value) => {
                  if (!value) return;
                  setCardForm((prev) => ({
                    ...prev,
                    side: value,
                    player: null,
                  }));
                  setCardErrors({});
                }}
              >
                <ToggleButton value="HOME">{game.home_team_name}</ToggleButton>
                <ToggleButton value="AWAY">{game.away_team_name}</ToggleButton>
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
                inputProps={{ min: 0, max: 150 }}
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
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {editingEvent && (
                  <Button onClick={() => resetForm()} disabled={submitting}>
                    編集をキャンセル
                  </Button>
                )}
                <Button type="submit" variant="contained" disabled={submitting}>
                  {editingEvent ? "カードを更新" : "カードを追加"}
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
              登録済みのカード
            </Typography>
            <CardTimeline
              events={cardEvents}
              homeTeamName={game.home_team_name}
              awayTeamName={game.away_team_name}
              onEdit={startEditing}
              onDelete={async (event) => {
                try {
                  const response = await fetch(`/api/game/v2/card/${event.id}`, { method: "DELETE" });
                  const data = await response.json().catch(() => null);
                  if (!response.ok) {
                    throw new Error(data?.message ?? "カードイベントの削除に失敗しました。");
                  }
                  if (editingEvent?.id === event.id) {
                    resetForm();
                  }
                  await onEventChanged();
                  setSnackbar({ open: true, message: "カードイベントを削除しました", severity: "success" });
                } catch (error) {
                  setSnackbar({
                    open: true,
                    message: error instanceof Error ? error.message : "カードイベントの削除に失敗しました。",
                    severity: "error",
                  });
                  throw error;
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

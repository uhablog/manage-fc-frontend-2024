import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { GoalTimeline } from "./GoalTimeLine";
import { PlayerOption } from "@/types/PlayerOption";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { SnackbarState } from "@/types/SnackbarState";
import { Game } from "@/types/Game";

type GoalFormState = {
  side: TeamSide;
  minute: string;
  scorer: PlayerOption | null;
  assist: PlayerOption | null;
  penalty: boolean;
};

type GoalFormErrors = Partial<{
  minute: string;
  scorer: string;
  assist: string;
}>;

const OWN_GOAL_OPTION: PlayerOption = {
  value: "0",
  label: "オウンゴール",
  isOwnGoal: true,
};

export default function GameResisterScorer({
  game,
  homePlayers,
  awayPlayers,
  setSnackbar,
  goalEvents,
  onEventChanged,
}: {
  game: Game
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  goalEvents: GoalTimelineEvent[];
  onEventChanged: () => Promise<void>;
}) {

  const [goalForm, setGoalForm] = useState<GoalFormState>({
    side: "HOME",
    minute: "",
    scorer: null,
    assist: null,
    penalty: false,
  });
  const [goalErrors, setGoalErrors] = useState<GoalFormErrors>({});
  const [editingEvent, setEditingEvent] = useState<GoalTimelineEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const goalScorerOptions = useMemo(() => {
    const base = goalForm.side === "HOME" ? homePlayers : awayPlayers;
    return [...base, OWN_GOAL_OPTION];
  }, [goalForm.side, homePlayers, awayPlayers]);

  const assistOptions = useMemo(
    () => (goalForm.side === "HOME" ? homePlayers : awayPlayers),
    [goalForm.side, homePlayers, awayPlayers],
  );

  const resetForm = (side: TeamSide = goalForm.side) => {
    setGoalForm({
      side,
      minute: "",
      scorer: null,
      assist: null,
      penalty: false,
    });
    setGoalErrors({});
    setEditingEvent(null);
  };

  const startEditing = (event: GoalTimelineEvent) => {
    setGoalForm({
      side: event.side,
      minute: String(event.minute),
      scorer: event.scorer,
      assist: event.assist ?? null,
      penalty: Boolean(event.penalty),
    });
    setGoalErrors({});
    setEditingEvent(event);
  };

  const handleGoalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const errors: GoalFormErrors = {};
    const minuteValue = Number(goalForm.minute);
    const teamId = goalForm.side === "HOME" ? game.home_team_id : game.away_team_id;
    if (Number.isNaN(minuteValue) || minuteValue < 0) {
      errors.minute = "0以上の分を入力してください。";
    }
    if (Number.isNaN(minuteValue) || minuteValue > 150) {
      errors.minute = "150以下の分を入力してください。";
    }
    if (!goalForm.scorer) {
      errors.scorer = "得点者を選択してください。";
    }
    if (goalForm.scorer?.value === goalForm.assist?.value) {
      errors.scorer = "アシストとは別の選手を入力してください。"
      errors.assist = "得点者とは別の選手を入力してください。"
    }

    setGoalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        editingEvent ? `/api/game/v2/goal/${editingEvent.id}` : `/api/game/v2/goal`,
        {
        method: editingEvent ? "PATCH" : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: game.game_id,
          team_id: teamId,
          minute: minuteValue,
          penalty: goalForm.penalty,
          scorer: {
            player_name: goalForm.scorer?.label,
            footballapi_player_id: goalForm.scorer?.value,
          },
          assist: goalForm.assist
            ? {
                player_name: goalForm.assist.label,
                footballapi_player_id: goalForm.assist.value,
              }
            : null,
        }),
        },
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        await onEventChanged();
        const wasEditing = Boolean(editingEvent);
        resetForm(goalForm.side);
        setSnackbar({
          open: true,
          message: wasEditing ? "得点を更新しました" : "得点を追加しました",
          severity: "success",
        });
      } else {
        throw new Error(data?.message ?? "得点イベントの保存に失敗しました。");
      }
    } catch (err) {
      console.error('Failed to submit game result:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "得点イベントの保存に失敗しました。",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }

  };

  return(
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleGoalSubmit}>
              <Typography variant="h6">{editingEvent ? "得点の編集" : "得点の登録"}</Typography>
              <ToggleButtonGroup
                value={goalForm.side}
                exclusive
                fullWidth
                onChange={(_, value) => {
                  if (!value) return;
                  setGoalForm((prev) => ({
                    ...prev,
                    side: value,
                    scorer: null,
                    assist: null,
                  }));
                  setGoalErrors({});
                }}
              >
                <ToggleButton value="HOME">{game.home_team_name}</ToggleButton>
                <ToggleButton value="AWAY">{game.away_team_name}</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                label="時間（分）"
                type="number"
                value={goalForm.minute}
                onChange={(event) => {
                  const value = event.target.value;
                  setGoalForm((prev) => ({
                    ...prev,
                    minute: value,
                  }));
                  setGoalErrors((prev) => ({ ...prev, minute: undefined }));
                }}
                error={Boolean(goalErrors.minute)}
                helperText={goalErrors.minute}
                inputProps={{ min: 0, max: 150 }}
              />
              <Autocomplete
                value={goalForm.scorer}
                onChange={(_, value) => {
                  setGoalForm((prev) => ({
                    ...prev,
                    scorer: value,
                  }));
                  setGoalErrors((prev) => ({ ...prev, scorer: undefined }));
                }}
                options={goalScorerOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="得点者"
                    error={Boolean(goalErrors.scorer)}
                    helperText={goalErrors.scorer}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
              />
              <Autocomplete
                value={goalForm.assist}
                onChange={(_, value) =>
                  setGoalForm((prev) => ({
                    ...prev,
                    assist: value,
                  }))
                }
                options={assistOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="アシスト（任意）"
                    error={Boolean(goalErrors.assist)}
                    helperText={goalErrors.assist}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={goalForm.penalty}
                    onChange={(_, checked) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        penalty: checked,
                      }))
                    }
                  />
                }
                label="PKでの得点"
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {editingEvent && (
                  <Button onClick={() => resetForm()} disabled={submitting}>
                    編集をキャンセル
                  </Button>
                )}
                <Button type="submit" variant="contained" disabled={submitting}>
                  {editingEvent ? "得点を更新" : "得点を追加"}
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
              登録済みの得点
            </Typography>
            <GoalTimeline
              events={goalEvents}
              homeTeamName={game.home_team_name}
              awayTeamName={game.away_team_name}
              onEdit={startEditing}
              onDelete={async (event) => {
                try {
                  const response = await fetch(`/api/game/v2/goal/${event.id}`, {
                    method: "DELETE",
                  });
                  const data = await response.json().catch(() => null);
                  if (!response.ok) {
                    throw new Error(data?.message ?? "得点イベントの削除に失敗しました。");
                  }
                  if (editingEvent?.id === event.id) {
                    resetForm();
                  }
                  await onEventChanged();
                  setSnackbar({ open: true, message: "得点を削除しました", severity: "success" });
                } catch (error) {
                  setSnackbar({
                    open: true,
                    message: error instanceof Error ? error.message : "得点イベントの削除に失敗しました。",
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
  )
};

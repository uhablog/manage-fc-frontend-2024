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
import { GoalTimeline } from "./GoalTimeLine";
import { PlayerOption } from "@/types/PlayerOption";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { SnackbarState } from "@/types/SnackbarState";

type GoalFormState = {
  side: TeamSide;
  minute: string;
  scorer: PlayerOption | null;
  assist: PlayerOption | null;
};

type GoalFormErrors = Partial<{
  minute: string;
  scorer: string;
}>;

const OWN_GOAL_OPTION: PlayerOption = {
  value: "own-goal",
  label: "オウンゴール",
  isOwnGoal: true,
};

export default function GameResisterScorer({
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

  const [goalForm, setGoalForm] = useState<GoalFormState>({
    side: "HOME",
    minute: "",
    scorer: null,
    assist: null,
  });
  const [goalErrors, setGoalErrors] = useState<GoalFormErrors>({});
  const [goalEvents, setGoalEvents] = useState<GoalTimelineEvent[]>([]);

  const goalScorerOptions = useMemo(() => {
    const base = goalForm.side === "HOME" ? homePlayers : awayPlayers;
    return [...base, OWN_GOAL_OPTION];
  }, [goalForm.side, homePlayers, awayPlayers]);

  const assistOptions = useMemo(
    () => (goalForm.side === "HOME" ? homePlayers : awayPlayers),
    [goalForm.side, homePlayers, awayPlayers],
  );

  const handleGoalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: GoalFormErrors = {};
    const minuteValue = Number(goalForm.minute);
    if (Number.isNaN(minuteValue) || minuteValue < 0) {
      errors.minute = "0以上の分を入力してください。";
    }
    if (!goalForm.scorer) {
      errors.scorer = "得点者を選択してください。";
    }

    setGoalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newEvent: GoalTimelineEvent = {
      id: `goal-${Date.now()}`,
      minute: minuteValue,
      side: goalForm.side,
      scorer: goalForm.scorer!,
      assist: goalForm.assist,
    };

    setGoalEvents((prev) => [...prev, newEvent].sort((a, b) => a.minute - b.minute));
    setGoalForm((prev) => ({
      ...prev,
      minute: "",
      scorer: null,
      assist: null,
    }));
    setGoalErrors({});
    setSnackbar({
      open: true,
      message: "得点イベントを追加しました（API未接続）。",
      severity: "success",
    });
  };

  return(
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleGoalSubmit}>
              <Typography variant="h6">得点の登録（デザインのみ）</Typography>
              <ToggleButtonGroup
                value={goalForm.side}
                exclusive
                fullWidth
                onChange={(_, value) => {
                  if (!value) return;
                  setGoalForm({
                    side: value,
                    minute: "",
                    scorer: null,
                    assist: null,
                  });
                  setGoalErrors({});
                }}
              >
                <ToggleButton value="HOME">{homeTeamName}</ToggleButton>
                <ToggleButton value="AWAY">{awayTeamName}</ToggleButton>
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
                inputProps={{ min: 0 }}
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
                  <TextField {...params} label="アシスト（任意）" />
                )}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  得点を追加
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
              登録済みの得点イベント
            </Typography>
            <GoalTimeline
              events={goalEvents}
              homeTeamName={homeTeamName}
              awayTeamName={awayTeamName}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
};

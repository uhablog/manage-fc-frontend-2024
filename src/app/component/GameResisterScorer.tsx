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
  onGoalAdded,
}: {
  game: Game
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  goalEvents: GoalTimelineEvent[];
  onGoalAdded: (event: GoalTimelineEvent) => void;
}) {

  const [goalForm, setGoalForm] = useState<GoalFormState>({
    side: "HOME",
    minute: "",
    scorer: null,
    assist: null,
    penalty: false,
  });
  const [goalErrors, setGoalErrors] = useState<GoalFormErrors>({});
  const goalScorerOptions = useMemo(() => {
    const base = goalForm.side === "HOME" ? homePlayers : awayPlayers;
    return [...base, OWN_GOAL_OPTION];
  }, [goalForm.side, homePlayers, awayPlayers]);

  const assistOptions = useMemo(
    () => (goalForm.side === "HOME" ? homePlayers : awayPlayers),
    [goalForm.side, homePlayers, awayPlayers],
  );

  const handleGoalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: GoalFormErrors = {};
    const minuteValue = Number(goalForm.minute);
    const teamId = goalForm.side === "HOME" ? game.home_team_id : game.away_team_id;
    if (Number.isNaN(minuteValue) || minuteValue < 1) {
      errors.minute = "1以上の分を入力してください。";
    }
    if (Number.isNaN(minuteValue) || minuteValue > 100) {
      errors.minute = "100以下の分を入力してください。";
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

    try {

      const response = await fetch(`/api/game/v2/goal`, {
        method: 'POST',
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
      });

      if (response.ok) {
        const newEvent: GoalTimelineEvent = {
          minute: minuteValue,
          side: goalForm.side,
          scorer: goalForm.scorer!,
          assist: goalForm.assist,
          penalty: goalForm.penalty,
        };

        onGoalAdded(newEvent);
        setGoalForm((prev) => ({
          ...prev,
          minute: "",
          scorer: null,
          assist: null,
          penalty: false,
        }));
        setGoalErrors({});
        setSnackbar({
          open: true,
          message: "得点を追加しました",
          severity: "success",
        });
      } else {
        window.alert('試合の登録に失敗');
      }
    } catch (err) {
      console.error('Failed to submit game result:', err);
    }

  };

  return(
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleGoalSubmit}>
              <Typography variant="h6">得点の登録</Typography>
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
                    penalty: false,
                  });
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
              登録済みの得点
            </Typography>
            <GoalTimeline
              events={goalEvents}
              homeTeamName={game.home_team_name}
              awayTeamName={game.away_team_name}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
};

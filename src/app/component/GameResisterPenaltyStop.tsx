import { Game } from "@/types/Game";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { PenaltyStopTimelineEvent } from "@/types/PenaltyStopTimelineEvent";
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
import { Dispatch, SetStateAction, useMemo, useState } from "react";

type PenaltyStopFormState = {
  side: TeamSide;
  minute: string;
  goalkeeper: PlayerOption | null;
};

type PenaltyStopFormErrors = Partial<{
  minute: string;
  goalkeeper: string;
  team: string;
}>;

type Props = {
  game: Game;
  homePlayers: PlayerOption[];
  awayPlayers: PlayerOption[];
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>;
  onPenaltyStopAdded: (event: PenaltyStopTimelineEvent) => void;
};

const createInitialFormState = (side: TeamSide = "HOME"): PenaltyStopFormState => ({
  side,
  minute: "",
  goalkeeper: null,
});

const toHalfWidth = (value: string) =>
  value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xFEE0),
  );

const normalizePosition = (position?: string) => {
  if (!position) return "";
  return toHalfWidth(position).trim().toUpperCase();
};

const isGoalkeeperPosition = (position?: string) => {
  const normalized = normalizePosition(position);
  if (!normalized) return false;
  return (
    normalized === "GK" ||
    normalized === "GOALKEEPER" ||
    normalized.includes("GK") ||
    normalized.includes("GOALKEEPER")
  );
};

export default function GameResisterPenaltyStop({
  game,
  homePlayers,
  awayPlayers,
  setSnackbar,
  onPenaltyStopAdded,
}: Props) {
  const [form, setForm] = useState<PenaltyStopFormState>(() => createInitialFormState());
  const [errors, setErrors] = useState<PenaltyStopFormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const goalkeeperOptions = useMemo(() => {
    const source = form.side === "HOME" ? homePlayers : awayPlayers;
    return source.filter((player) => isGoalkeeperPosition(player.position));
  }, [form.side, homePlayers, awayPlayers]);

  const resetForm = (side: TeamSide) => {
    setForm(createInitialFormState(side));
    setErrors({});
  };

  const handleGoalkeeperChange = (_: unknown, value: PlayerOption | null) => {
    setForm((prev) => ({
      ...prev,
      goalkeeper: value,
    }));
    setErrors((prev) => ({
      ...prev,
      goalkeeper: value ? undefined : prev.goalkeeper,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const validationErrors: PenaltyStopFormErrors = {};
    const minuteValue = Number(form.minute);

    if (form.minute.trim() === "") {
      validationErrors.minute = "時間を入力してください。";
    } else if (Number.isNaN(minuteValue) || minuteValue < 0 || minuteValue > 150) {
      validationErrors.minute = "0〜150の数値を入力してください。";
    }

    if (!form.goalkeeper) {
      validationErrors.goalkeeper = "GKを選択してください。";
    }

    const teamId = form.side === "HOME" ? game.home_team_id : game.away_team_id;
    if (!teamId) {
      validationErrors.team = "チーム情報を取得できません。";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).some((key) => Boolean(validationErrors[key as keyof PenaltyStopFormErrors]))) {
      return;
    }

    const selectedGoalkeeper = form.goalkeeper!;

    const payload: Record<string, unknown> = {
      game_id: game.game_id,
      team_id: teamId,
      gk_name: selectedGoalkeeper.label,
      footballapi_player_id: selectedGoalkeeper.value,
    };

    payload.minute = minuteValue;
    payload.goalkeeper = {
      player_name: selectedGoalkeeper.label,
      footballapi_player_id: selectedGoalkeeper.value,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`/api/game/v2/penalty-stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "PKストップの登録に失敗しました。");
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "PKストップを登録しました。",
      });
      onPenaltyStopAdded({
        minute: minuteValue,
        side: form.side,
        goalkeeper: {
          value: selectedGoalkeeper.value,
          label: selectedGoalkeeper.label,
          position: selectedGoalkeeper.position,
        },
      });
      resetForm(form.side);
    } catch (error) {
      console.error("failed to submit penalty stop", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error instanceof Error ? error.message : "PKストップの登録に失敗しました。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h6">PKストップの登録</Typography>
          <ToggleButtonGroup
            value={form.side}
            exclusive
            fullWidth
            onChange={(_, value) => {
              if (!value) return;
              resetForm(value);
            }}
          >
            <ToggleButton value="HOME">{game.home_team_name}</ToggleButton>
            <ToggleButton value="AWAY">{game.away_team_name}</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="時間（分）"
            type="number"
            required
            value={form.minute}
            onChange={(event) => {
              const value = event.target.value;
              setForm((prev) => ({ ...prev, minute: value }));
              setErrors((prev) => ({ ...prev, minute: undefined }));
            }}
            error={Boolean(errors.minute)}
            helperText={errors.minute}
            inputProps={{ min: 0, max: 150 }}
          />
          <Autocomplete
            value={form.goalkeeper}
            onChange={handleGoalkeeperChange}
            options={goalkeeperOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="GKの選手"
                required
                error={Boolean(errors.goalkeeper)}
                helperText={errors.goalkeeper}
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
          />
          {errors.team && (
            <Typography color="error" variant="body2">
              {errors.team}
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={submitting}>
              PKストップを追加
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

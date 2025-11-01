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
  onCardAdded: (event: CardTimelineEvent) => void;
};

export default function GameResisterCard({
  game,
  homePlayers,
  awayPlayers,
  setSnackbar,
  cardEvents,
  onCardAdded,
}: Props) {
  const [cardForm, setCardForm] = useState<CardFormState>({
    side: "HOME",
    minute: "",
    player: null,
    cardType: "YELLOW",
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});

  const cardPlayerOptions = useMemo(
    () => (cardForm.side === "HOME" ? homePlayers : awayPlayers),
    [cardForm.side, homePlayers, awayPlayers],
  );

  const handleCardSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: CardFormErrors = {};
    const minuteValue = Number(cardForm.minute);
    if (Number.isNaN(minuteValue) || minuteValue < 1) {
      errors.minute = "1以上の分を入力してください。";
    }
    if (Number.isNaN(minuteValue) || minuteValue > 100) {
      errors.minute = "100以下の分を入力してください。";
    }
    if (!cardForm.player) {
      errors.player = "対象選手を選択してください。";
    }

    setCardErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await fetch(`/api/game/v2/card`, {
        method: "POST",
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
      });

      if (response.ok) {
        const newEvent: CardTimelineEvent = {
          minute: minuteValue,
          side: cardForm.side,
          player: cardForm.player!,
          cardType: cardForm.cardType,
        };

        onCardAdded(newEvent);
        setCardForm((prev) => ({
          ...prev,
          minute: "",
          player: null,
        }));
        setCardErrors({});
        setSnackbar({
          open: true,
          message: "カードイベントを追加しました",
          severity: "success",
        });
      } else {
        window.alert("カードイベントの登録に失敗しました");
      }
    } catch (error) {
      console.error("Failed to submit card event", error);
    }
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleCardSubmit}>
              <Typography variant="h6">カードの登録</Typography>
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
                  });
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
              登録済みのカード
            </Typography>
            <CardTimeline
              events={cardEvents}
              homeTeamName={game.home_team_name}
              awayTeamName={game.away_team_name}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

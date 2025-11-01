import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { grey } from "@mui/material/colors";
import ButtonAppBar from "./GameDetailAppBar";
import DisplayComments from "./DisplayComments";
import BottomTextField from "./BottomTextField";
import { Game } from "@/types/Game";
import { Comment } from "@/types/Comment";
import { ResultPreview } from "@/types/ResultPreview";
import MatchSummaryCard from "./MatchSummaryCard";

type Props = {
  id: string;
  game_id: string;
};

type PlayerOption = {
  value: string;
  label: string;
  isOwnGoal?: boolean;
};

type GoalTimelineEvent = {
  id: string;
  minute: number;
  side: TeamSide;
  scorer: PlayerOption;
  assist?: PlayerOption | null;
};

type CardTimelineEvent = {
  id: string;
  minute: number;
  side: TeamSide;
  player: PlayerOption;
  cardType: "YELLOW" | "RED";
  note?: string;
};

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

type ResultFormState = {
  homeScore: string;
  awayScore: string;
  momSide: TeamSide;
  momPlayer: PlayerOption | null;
  note: string;
  confirmed: boolean;
};

type ResultFormErrors = Partial<{
  homeScore: string;
  awayScore: string;
  momPlayer: string;
  confirmed: string;
}>;

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const PLAYER_TEMPLATES = [
  { number: "#9", name: "山田 太郎" },
  { number: "#7", name: "佐藤 次郎" },
  { number: "#8", name: "鈴木 三郎" },
  { number: "#3", name: "田中 四郎" },
  { number: "#11", name: "高橋 五郎" },
];

const OWN_GOAL_OPTION: PlayerOption = {
  value: "own-goal",
  label: "オウンゴール",
  isOwnGoal: true,
};

const GameDetail = ({ id, game_id }: Props) => {
  const [game, setGame] = useState<Game>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<number>(0);

  const [goalForm, setGoalForm] = useState<GoalFormState>({
    side: "HOME",
    minute: "",
    scorer: null,
    assist: null,
  });
  const [goalErrors, setGoalErrors] = useState<GoalFormErrors>({});
  const [goalEvents, setGoalEvents] = useState<GoalTimelineEvent[]>([]);

  const [cardForm, setCardForm] = useState<CardFormState>({
    side: "HOME",
    minute: "",
    player: null,
    cardType: "YELLOW",
    note: "",
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [cardEvents, setCardEvents] = useState<CardTimelineEvent[]>([]);

  const [resultForm, setResultForm] = useState<ResultFormState>({
    homeScore: "",
    awayScore: "",
    momSide: "HOME",
    momPlayer: null,
    note: "",
    confirmed: false,
  });
  const [resultErrors, setResultErrors] = useState<ResultFormErrors>({});
  const [resultPreview, setResultPreview] = useState<ResultPreview>({
    homeScore: 0,
    awayScore: 0,
    momName: "",
    momSide: null,
  });
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/game?game_id=${game_id}`);
        const json = await res.json();

        if (json.success) {
          setGame(json.game);
          setComments(Array.isArray(json.comments) ? json.comments : []);
        } else {
          setError("試合情報の取得に失敗しました。");
        }
      } catch (err) {
        console.error(err);
        setError("試合情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [game_id]);

  useEffect(() => {
    if (!game) return;
    setResultForm((prev) => ({
      ...prev,
      homeScore: String(game.home_team_score ?? 0),
      awayScore: String(game.away_team_score ?? 0),
      momSide:
        game.mom_team_id && game.away_team_id && game.mom_team_id === game.away_team_id
          ? "AWAY"
          : "HOME",
      momPlayer: null,
    }));
    setResultPreview({
      homeScore: game.home_team_score ?? 0,
      awayScore: game.away_team_score ?? 0,
      momName: game.mom ?? "",
      momSide:
        game.mom_team_id && game.away_team_id && game.mom_team_id === game.away_team_id
          ? "AWAY"
          : game.mom_team_id
          ? "HOME"
          : null,
    });
  }, [game]);

  const homePlayers = useMemo(() => createPlayerOptions("HOME"), []);
  const awayPlayers = useMemo(() => createPlayerOptions("AWAY"), []);

  const goalScorerOptions = useMemo(() => {
    const base = goalForm.side === "HOME" ? homePlayers : awayPlayers;
    return [...base, OWN_GOAL_OPTION];
  }, [goalForm.side, homePlayers, awayPlayers]);

  const assistOptions = useMemo(
    () => (goalForm.side === "HOME" ? homePlayers : awayPlayers),
    [goalForm.side, homePlayers, awayPlayers],
  );

  const cardPlayerOptions = useMemo(
    () => (cardForm.side === "HOME" ? homePlayers : awayPlayers),
    [cardForm.side, homePlayers, awayPlayers],
  );

  const momOptions = useMemo(
    () => (resultForm.momSide === "HOME" ? homePlayers : awayPlayers),
    [resultForm.momSide, homePlayers, awayPlayers],
  );

  const homeTeamName = game?.home_team_name ?? "ホームチーム";
  const awayTeamName = game?.away_team_name ?? "アウェイチーム";

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

  const postComment = async (comment: string) => {
    if (!comment || comment === "") return;

    try {
      const response = await fetch(`/api/game/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id,
          comment,
        }),
      });
      const json = await response.json();
      if (json.success) {
        const newComment = {
          comment: json.comment.comment,
          id: json.comment.id,
          user_id: json.comment.user_id,
        };
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <>
        <ButtonAppBar convention_id={id} game_id={game_id} />
        <Box sx={{ px: 2, py: 4 }}>
          <Typography>試合情報の取得中...</Typography>
        </Box>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <ButtonAppBar convention_id={id} game_id={game_id} />
        <Box sx={{ px: 2, py: 4 }}>
          <Alert severity="error">{error ?? "試合情報を取得できませんでした。"}</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <ButtonAppBar convention_id={id} game_id={game_id} />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Stack spacing={3}>
          <MatchSummaryCard
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            homeEmblem={game.home_team_emblem_url}
            awayEmblem={game.away_team_emblem_url}
            preview={resultPreview}
          />
          <Box>
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="game management tabs"
            >
              <Tab label="得点" />
              <Tab label="カード" />
              <Tab label="試合結果" />
            </Tabs>
            <TabPanel value={tab} index={0}>
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
            </TabPanel>
            <TabPanel value={tab} index={1}>
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
            </TabPanel>
            <TabPanel value={tab} index={2}>
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
                    preview={resultPreview}
                    note={resultForm.note}
                  />
                </Grid2>
              </Grid2>
            </TabPanel>
          </Box>
          <DisplayComments comments={comments} />
        </Stack>
      </Box>
      <BottomTextField onButtonClick={postComment} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
  );
};

const TabPanel = ({ children, value, index }: { children?: ReactNode; value: number; index: number }) => {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
};

const GoalTimeline = ({
  events,
  homeTeamName,
  awayTeamName,
}: {
  events: GoalTimelineEvent[];
  homeTeamName: string;
  awayTeamName: string;
}) => {
  if (events.length === 0) {
    return <TimelineEmpty message="まだ得点が登録されていません。" />;
  }

  return (
    <Stack spacing={1.5}>
      {events.map((event) => {
        const teamName = event.side === "HOME" ? homeTeamName : awayTeamName;
        return (
          <Card key={event.id} variant="outlined" sx={{ borderColor: grey[200] }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`${event.minute}'`} size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {event.scorer.label}
                    {event.scorer.isOwnGoal ? " (OG)" : ""}
                  </Typography>
                  <Typography variant="body2" color={grey[600]}>
                    {event.assist ? `Assist: ${event.assist.label} / ` : ""}
                    {teamName}
                  </Typography>
                </Box>
                <SportsSoccerIcon
                  fontSize="small"
                  color={event.side === "HOME" ? "success" : "primary"}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

const CardTimeline = ({
  events,
  homeTeamName,
  awayTeamName,
}: {
  events: CardTimelineEvent[];
  homeTeamName: string;
  awayTeamName: string;
}) => {
  if (events.length === 0) {
    return <TimelineEmpty message="まだカードが登録されていません。" />;
  }

  return (
    <Stack spacing={1.5}>
      {events.map((event) => {
        const teamName = event.side === "HOME" ? homeTeamName : awayTeamName;
        return (
          <Card key={event.id} variant="outlined" sx={{ borderColor: grey[200] }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`${event.minute}'`} size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{event.player.label}</Typography>
                  <Typography variant="body2" color={grey[600]}>
                    {teamName}
                    {event.note ? ` / 備考: ${event.note}` : ""}
                  </Typography>
                </Box>
                <SquareRoundedIcon
                  fontSize="small"
                  sx={{
                    color: event.cardType === "YELLOW" ? "#fbc02d" : "#d32f2f",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

const ResultPreviewCard = ({
  homeTeamName,
  awayTeamName,
  preview,
  note,
}: {
  homeTeamName: string;
  awayTeamName: string;
  preview: ResultPreview;
  note: string;
}) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        現在のプレビュー
      </Typography>
      <Stack spacing={1}>
        <Typography variant="h5">
          {homeTeamName} {preview.homeScore} - {preview.awayScore} {awayTeamName}
        </Typography>
        <Typography variant="body2" color={grey[600]}>
          MOM: {preview.momName || "未選択"}
        </Typography>
        <Typography variant="body2" color={grey[600]}>
          備考: {note || "入力なし"}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const TimelineEmpty = ({ message }: { message: string }) => (
  <Card variant="outlined" sx={{ borderStyle: "dashed", borderColor: grey[300] }}>
    <CardContent>
      <Typography variant="body2" color={grey[600]}>
        {message}
      </Typography>
    </CardContent>
  </Card>
);

const createPlayerOptions = (side: TeamSide): PlayerOption[] =>
  PLAYER_TEMPLATES.map((template, index) => ({
    value: `${side}-${index}`,
    label: `${template.number} ${template.name}`,
  }));

export default GameDetail;

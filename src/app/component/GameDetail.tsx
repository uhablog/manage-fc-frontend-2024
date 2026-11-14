import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ButtonAppBar from "./GameDetailAppBar";
import DisplayComments from "./DisplayComments";
import { Game } from "@/types/Game";
import { Comment } from "@/types/Comment";
import GameResisterScorer from "./GameResisterScorer";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { Squad } from "@/types/Squads";
import GameResisterCard from "./GameResisterCard";
import GameResisterPenaltyStop from "./GameResisterPenaltyStop";
import { ResultFormState } from "@/types/ResultFormState";
import GameResultConfirm from "./GameResultConfirm";
import GameScore from "./GameScore";
import GameMomCard from "./GameMomCard";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { PenaltyStopTimelineEvent } from "@/types/PenaltyStopTimelineEvent";
import { Facts } from "./Facts";
import { HeadToHeadGameDetail } from "./HeadToHeadGameDetail";
import LineUpForm from "./LineUpForm";
import { LineUp } from "./LineUp";

type Props = {
  id: string;
  game_id: string;
};

type FetchGameOptions = {
  showLoading?: boolean;
  background?: boolean;
};

const GAME_REFRESH_INTERVAL_MS = 10_000;

const GameDetail = ({ id, game_id }: Props) => {
  const [game, setGame] = useState<Game>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<number>(0);

  const [resultForm, setResultForm] = useState<ResultFormState>({
    momSide: "HOME",
    momPlayer: null,
    momRating: null,
    confirmed: false,
  });

  const [homePlayers, setHomePlayers] = useState<PlayerOption[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerOption[]>([]);
  const [homeSquads, setHomeSquads] = useState<Squad[]>([]);
  const [awaySquads, setAwaySquads] = useState<Squad[]>([]);
  const [squadsLoading, setSquadsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [goalEvents, setGoalEvents] = useState<GoalTimelineEvent[]>([]);
  const [cardEvents, setCardEvents] = useState<CardTimelineEvent[]>([]);
  const [penaltyStopEvents, setPenaltyStopEvents] = useState<PenaltyStopTimelineEvent[]>([]);
  const [isResultConfirmed, setIsResultConfirmed] = useState<boolean>(false);
  const gameRequestControllerRef = useRef<AbortController | null>(null);
  const gameRequestInFlightRef = useRef(false);
  const initializedResultGameIdRef = useRef<string | null>(null);
  const previousConfirmedRef = useRef<boolean | null>(null);

  const fetchGame = useCallback(async ({
    showLoading = true,
    background = false,
  }: FetchGameOptions = {}) => {
    if (background && gameRequestInFlightRef.current) return;

    gameRequestControllerRef.current?.abort();
    const controller = new AbortController();
    gameRequestControllerRef.current = controller;
    gameRequestInFlightRef.current = true;

    if (showLoading) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetch(`/api/game?game_id=${game_id}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`試合情報の取得に失敗しました (${res.status})`);
      }

      const json = await res.json();

      if (json.success) {
        setGame(json.game);
        setComments(Array.isArray(json.comments) ? json.comments : []);
        setError(null);
      } else {
        throw new Error(json.message ?? "試合情報の取得に失敗しました。");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      if (!background) {
        setError("試合情報の取得に失敗しました。");
      }
    } finally {
      if (gameRequestControllerRef.current === controller) {
        gameRequestControllerRef.current = null;
        gameRequestInFlightRef.current = false;
        if (showLoading) setLoading(false);
      }
    }
  }, [game_id]);

  useEffect(() => {
    void fetchGame();

    return () => {
      gameRequestControllerRef.current?.abort();
    };
  }, [fetchGame]);

  const refreshGame = useCallback(async () => {
    await fetchGame({ showLoading: false });
  }, [fetchGame]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState !== "visible") return;
      void fetchGame({ showLoading: false, background: true });
    };

    const intervalId = window.setInterval(refreshWhenVisible, GAME_REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [fetchGame]);

  useEffect(() => {
    if (!game) return;

    if (initializedResultGameIdRef.current !== game.game_id) {
      initializedResultGameIdRef.current = game.game_id;
      setResultForm({
        momSide:
          game.mom_team_id && game.away_team_id && game.mom_team_id === game.away_team_id
            ? "AWAY"
            : "HOME",
        momPlayer: null,
        momRating: null,
        confirmed: Boolean(game.confirmed),
      });
      setTab(0);
    }

    setGoalEvents(sortGoalEvents(buildGoalEventsFromGame(game)));
    setCardEvents(sortCardEvents(buildCardEventsFromGame(game)));
    setPenaltyStopEvents(sortPenaltyStopEvents(buildPenaltyStopEventsFromGame(game)));

    const confirmed = Boolean(game.confirmed);
    if (previousConfirmedRef.current !== null && previousConfirmedRef.current !== confirmed) {
      setTab(0);
    }
    previousConfirmedRef.current = confirmed;
    setIsResultConfirmed(confirmed);
  }, [game]);

  const homeTeamId = game?.home_team_id;
  const awayTeamId = game?.away_team_id;

  useEffect(() => {
    if (!homeTeamId && !awayTeamId) {
      setHomePlayers([]);
      setAwayPlayers([]);
      setHomeSquads([]);
      setAwaySquads([]);
      setSquadsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchSquads = async () => {
      setSquadsLoading(true);

      try {
        if (homeTeamId) {
          const res = await fetch(`/api/team/squads?team_id=${homeTeamId}`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const json = await res.json();
            const squads: Squad[] = Array.isArray(json.squads) ? json.squads : [];
            setHomeSquads(squads);
            setHomePlayers(squads.map(mapSquadToPlayerOption));
          } else {
            console.error("home squad fetch failed", res.status);
            setHomeSquads([]);
            setHomePlayers([]);
          }
        } else {
          setHomeSquads([]);
          setHomePlayers([]);
        }

        if (awayTeamId) {
          const res = await fetch(`/api/team/squads?team_id=${awayTeamId}`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const json = await res.json();
            const squads: Squad[] = Array.isArray(json.squads) ? json.squads : [];
            setAwaySquads(squads);
            setAwayPlayers(squads.map(mapSquadToPlayerOption));
          } else {
            console.error("away squad fetch failed", res.status);
            setAwaySquads([]);
            setAwayPlayers([]);
          }
        } else {
          setAwaySquads([]);
          setAwayPlayers([]);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("failed to fetch squads", err);
        setHomeSquads([]);
        setAwaySquads([]);
        setHomePlayers([]);
        setAwayPlayers([]);
      } finally {
        if (!controller.signal.aborted) {
          setSquadsLoading(false);
        }
      }
    };

    void fetchSquads();

    return () => {
      controller.abort();
    };
  }, [homeTeamId, awayTeamId]);

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
          <GameScore
            convention_id={id}
            game={game}
          />
          {isResultConfirmed ? (
            <>
              <Box>
                <Tabs
                  value={tab}
                  onChange={(_, value) => setTab(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="game management tabs"
                >
                  <Tab label="Facts" />
                  <Tab label="LineUp" />
                  <Tab label="通算成績" />
                  <Tab label="コメント" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                  <Stack spacing={3}>
                    <GameMomCard game={game} />
                    <Facts
                      goalEvents={goalEvents}
                      cardEvents={cardEvents}
                      penaltyStopEvents={penaltyStopEvents}
                      game={game}
                    />
                  </Stack>
                </TabPanel>
              <TabPanel value={tab} index={1}>
                <LineUp
                  gameId={game_id}
                  homeTeamId={game.home_team_id}
                  awayTeamId={game.away_team_id}
                  homeTeamName={game.home_team_name}
                  awayTeamName={game.away_team_name}
                />
              </TabPanel>
                <TabPanel value={tab} index={2}>
                  <HeadToHeadGameDetail
                    game={game}
                  />
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  <DisplayComments
                    game_id={game_id}
                    comments={comments}
                    setComments={setComments}
                  />
                </TabPanel>
              </Box>
            </>
          ) : (
            <Box>
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="game management tabs"
              >
                <Tab label="Facts" />
                <Tab label="通算成績" />
                <Tab label="得点" />
                <Tab label="カード" />
                <Tab label="PKストップ" />
                <Tab label="ラインナップ" />
                <Tab label="試合結果" />
                <Tab label="コメント" />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <Facts
                  goalEvents={goalEvents}
                  cardEvents={cardEvents}
                  penaltyStopEvents={penaltyStopEvents}
                  game={game}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <HeadToHeadGameDetail
                  game={game}
                />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <GameResisterScorer
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  goalEvents={goalEvents}
                  onEventChanged={refreshGame}
                />
              </TabPanel>
              <TabPanel value={tab} index={3}>
                <GameResisterCard
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  cardEvents={cardEvents}
                  onEventChanged={refreshGame}
                />
              </TabPanel>
              <TabPanel value={tab} index={4}>
                <GameResisterPenaltyStop
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  penaltyStopEvents={penaltyStopEvents}
                  onEventChanged={refreshGame}
                />
              </TabPanel>
              <TabPanel value={tab} index={5}>
                <LineUpForm
                  gameId={game.game_id}
                  homeSquads={homeSquads}
                  awaySquads={awaySquads}
                  loadingSquads={squadsLoading}
                  onSubmitSuccess={() =>
                    setSnackbar({
                      open: true,
                      message: "ラインナップを送信しました。",
                      severity: "success",
                    })
                  }
                />
              </TabPanel>
              <TabPanel value={tab} index={6}>
                <GameResultConfirm
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  resultForm={resultForm}
                  setResultForm={setResultForm}
                />
              </TabPanel>
              <TabPanel value={tab} index={7}>
                <DisplayComments
                  game_id={game_id}
                  comments={comments}
                  setComments={setComments}
                />
              </TabPanel>
            </Box>
          )}
        </Stack>
      </Box>

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

    </>
  );
};

const TabPanel = ({ children, value, index }: { children?: ReactNode; value: number; index: number }) => {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
};

const mapSquadToPlayerOption = (player: Squad): PlayerOption => ({
  value: String(player.footballapi_player_id),
  label: player.player_name,
  position: player.position ?? player.potision,
});

const sortGoalEvents = (events: GoalTimelineEvent[]): GoalTimelineEvent[] =>
  [...events].sort((a, b) => {
    const minuteA = normalizeMinute(a.minute);
    const minuteB = normalizeMinute(b.minute);
    if (minuteA === minuteB) {
      return a.side === "HOME" && b.side === "AWAY" ? -1 : 1;
    }
    return minuteA - minuteB;
  });

const sortCardEvents = (events: CardTimelineEvent[]): CardTimelineEvent[] =>
  [...events].sort((a, b) => {
    const minuteA = normalizeMinute(a.minute);
    const minuteB = normalizeMinute(b.minute);
    if (minuteA === minuteB) {
      return a.side === "HOME" && b.side === "AWAY" ? -1 : 1;
    }
    return minuteA - minuteB;
  });

const buildGoalEventsFromGame = (game: Game): GoalTimelineEvent[] => {
  const events: GoalTimelineEvent[] = [];

  const createOption = (id: number | string | null | undefined, name: string): PlayerOption => ({
    value: String(id ?? name),
    label: name,
  });

  const build = (
    scorers: Game["home_team_scorer"],
    side: TeamSide,
  ) => {
    scorers.forEach((scorer) => {
      const scorerOption = createOption(scorer.footballapi_player_id, scorer.name);
      const assistSource = scorer.assist;
      const assistOption = assistSource
        ? createOption(assistSource.footballapi_player_id, assistSource.name)
        : null;

      events.push({
        id: scorer.id,
        minute: normalizeMinute(scorer.minuts),
        side,
        scorer: scorerOption,
        assist: assistOption,
        penalty: Boolean(scorer.penalty),
      });
    });
  };

  build(game.home_team_scorer, "HOME");
  build(game.away_team_scorer, "AWAY");

  return sortGoalEvents(events);
};

const buildCardEventsFromGame = (game: Game): CardTimelineEvent[] => {
  const events: CardTimelineEvent[] = [];

  const createOption = (id: number | string | null | undefined, name: string): PlayerOption => ({
    value: String(id ?? name),
    label: name,
  });

  const build = (
    cards: Game["home_team_yellow_cards"],
    side: TeamSide,
    cardType: "YELLOW" | "RED",
  ) => {
    cards.forEach((card) => {
      events.push({
        id: card.id,
        minute: normalizeMinute(card.minuts),
        side,
        player: createOption(card.footballapi_player_id, card.name),
        cardType,
      });
    });
  };

  build(game.home_team_yellow_cards, "HOME", "YELLOW");
  build(game.away_team_yellow_cards, "AWAY", "YELLOW");
  build(game.home_team_red_cards, "HOME", "RED");
  build(game.away_team_red_cards, "AWAY", "RED");

  return sortCardEvents(events);
};

const sortPenaltyStopEvents = (events: PenaltyStopTimelineEvent[]): PenaltyStopTimelineEvent[] =>
  [...events].sort((a, b) => {
    const minuteA = normalizeMinute(a.minute);
    const minuteB = normalizeMinute(b.minute);
    if (minuteA === minuteB) {
      return a.side === "HOME" && b.side === "AWAY" ? -1 : 1;
    }
    return minuteA - minuteB;
  });

const buildPenaltyStopEventsFromGame = (game: Game): PenaltyStopTimelineEvent[] => {
  const events: PenaltyStopTimelineEvent[] = [];

  const createOption = (id: number | string | null | undefined, name: string): PlayerOption => ({
    value: String(id ?? name),
    label: name,
  });

  const build = (
    stops: Game["home_team_penalty_stops"],
    side: TeamSide,
  ) => {
    stops.forEach((stop) => {
      const resolvedMinute = stop.minute ?? stop.minuts;
      events.push({
        id: stop.id,
        minute: normalizeMinute(resolvedMinute),
        side,
        goalkeeper: createOption(stop.footballapi_player_id, stop.name),
      });
    });
  };

  build(game.home_team_penalty_stops, "HOME");
  build(game.away_team_penalty_stops, "AWAY");

  return sortPenaltyStopEvents(events);
};

const normalizeMinute = (minute: number | null | undefined) => {
  const parsed = Number(minute);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default GameDetail;

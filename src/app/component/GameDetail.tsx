import { useEffect, useState, type ReactNode } from "react";
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
import BottomTextField from "./BottomTextField";
import { Game } from "@/types/Game";
import { Comment } from "@/types/Comment";
import GameResisterScorer from "./GameResisterScorer";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { Squad } from "@/types/Squads";
import GameResisterCard from "./GameResisterCard";
import { ResultFormState } from "@/types/ResultFormState";
import GameResultConfirm from "./GameResultConfirm";
import GameScore from "./GameScore";
import GameMomCard from "./GameMomCard";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import GameFlowTimeline from "./GameFlowTimeline";

type Props = {
  id: string;
  game_id: string;
};

const GameDetail = ({ id, game_id }: Props) => {
  const [game, setGame] = useState<Game>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<number>(0);

  const [resultForm, setResultForm] = useState<ResultFormState>({
    momSide: "HOME",
    momPlayer: null,
    confirmed: false,
  });

  const [homePlayers, setHomePlayers] = useState<PlayerOption[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerOption[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [goalEvents, setGoalEvents] = useState<GoalTimelineEvent[]>([]);
  const [cardEvents, setCardEvents] = useState<CardTimelineEvent[]>([]);
  const [isResultConfirmed, setIsResultConfirmed] = useState<boolean>(false);

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
    setResultForm({
      momSide:
        game.mom_team_id && game.away_team_id && game.mom_team_id === game.away_team_id
          ? "AWAY"
          : "HOME",
      momPlayer: null,
      confirmed: Boolean(game.confirmed),
    });
    setGoalEvents(sortGoalEvents(buildGoalEventsFromGame(game)));
    setCardEvents(sortCardEvents(buildCardEventsFromGame(game)));
    setIsResultConfirmed(Boolean(game.confirmed));
  }, [game]);

  useEffect(() => {
    if (!game) {
      setHomePlayers([]);
      setAwayPlayers([]);
      return;
    }

    const fetchSquads = async () => {
      const { home_team_auth0_user_id, away_team_auth0_user_id } = game;

      try {
        if (home_team_auth0_user_id) {
          const res = await fetch(`/api/user/squads?user_id=${home_team_auth0_user_id}`);
          if (res.ok) {
            const json = await res.json();
            const squads: Squad[] = Array.isArray(json.squads) ? json.squads : [];
            setHomePlayers(squads.map(mapSquadToPlayerOption));
          } else {
            console.error("home squad fetch failed", res.status);
            setHomePlayers([]);
          }
        } else {
          setHomePlayers([]);
        }

        if (away_team_auth0_user_id) {
          const res = await fetch(`/api/user/squads?user_id=${away_team_auth0_user_id}`);
          if (res.ok) {
            const json = await res.json();
            const squads: Squad[] = Array.isArray(json.squads) ? json.squads : [];
            setAwayPlayers(squads.map(mapSquadToPlayerOption));
          } else {
            console.error("away squad fetch failed", res.status);
            setAwayPlayers([]);
          }
        } else {
          setAwayPlayers([]);
        }
      } catch (err) {
        console.error("failed to fetch squads", err);
        setHomePlayers([]);
        setAwayPlayers([]);
      }
    };

    fetchSquads();
  }, [game]);

  const handleGoalAdded = (event: GoalTimelineEvent) => {
    setGoalEvents((prev) => sortGoalEvents([...prev, event]));
    setGame((prev) => {
      if (!prev) return prev;
      if (event.side === "HOME") {
        const updatedAssists = event.assist
          ? [...prev.home_team_assists, {
              name: event.assist.label,
              footballapi_player_id: parsePlayerId(event.assist.value),
            }]
          : prev.home_team_assists;
        return {
          ...prev,
          home_team_score: prev.home_team_score + 1,
          home_team_scorer: [
            ...prev.home_team_scorer,
            {
              name: event.scorer.label,
              footballapi_player_id: parsePlayerId(event.scorer.value),
              minuts: normalizeMinute(event.minute),
            },
          ],
          home_team_assists: updatedAssists,
        };
      }

      const updatedAssists = event.assist
        ? [...prev.away_team_assists, {
            name: event.assist.label,
            footballapi_player_id: parsePlayerId(event.assist.value),
          }]
        : prev.away_team_assists;
      return {
        ...prev,
        away_team_score: prev.away_team_score + 1,
        away_team_scorer: [
          ...prev.away_team_scorer,
          {
            name: event.scorer.label,
            footballapi_player_id: parsePlayerId(event.scorer.value),
            minuts: normalizeMinute(event.minute),
          },
        ],
        away_team_assists: updatedAssists,
      };
    });
  };

  const handleCardAdded = (event: CardTimelineEvent) => {
    setCardEvents((prev) => sortCardEvents([...prev, event]));
    setGame((prev) => {
      if (!prev) return prev;
      const cardEntry = {
        name: event.player.label,
        footballapi_player_id: parsePlayerId(event.player.value),
        minuts: normalizeMinute(event.minute),
      };

      if (event.side === "HOME") {
        if (event.cardType === "YELLOW") {
          return {
            ...prev,
            home_team_yellow_cards: [...prev.home_team_yellow_cards, cardEntry],
          };
        }
        return {
          ...prev,
          home_team_red_cards: [...prev.home_team_red_cards, cardEntry],
        };
      }

      if (event.cardType === "YELLOW") {
        return {
          ...prev,
          away_team_yellow_cards: [...prev.away_team_yellow_cards, cardEntry],
        };
      }
      return {
        ...prev,
        away_team_red_cards: [...prev.away_team_red_cards, cardEntry],
      };
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
          <GameScore
            convention_id={id}
            game={game}
          />
          {isResultConfirmed ? (
            <>
              <GameMomCard game={game} />
              <GameFlowTimeline
                goalEvents={goalEvents}
                cardEvents={cardEvents}
                homeTeamName={game.home_team_name}
                awayTeamName={game.away_team_name}
              />
              <DisplayComments comments={comments} />
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
                <Tab label="Event" />
                <Tab label="得点" />
                <Tab label="カード" />
                <Tab label="試合結果" />
                <Tab label="コメント" />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <GameFlowTimeline
                  goalEvents={goalEvents}
                  cardEvents={cardEvents}
                  homeTeamName={game.home_team_name}
                  awayTeamName={game.away_team_name}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <GameResisterScorer
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  goalEvents={goalEvents}
                  onGoalAdded={handleGoalAdded}
                />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <GameResisterCard
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  cardEvents={cardEvents}
                  onCardAdded={handleCardAdded}
                />
              </TabPanel>
              <TabPanel value={tab} index={3}>
                <GameResultConfirm
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  resultForm={resultForm}
                  setResultForm={setResultForm}
                />
              </TabPanel>
              <TabPanel value={tab} index={4}>
                <DisplayComments comments={comments} />
              </TabPanel>
            </Box>
          )}
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
    scorers: { name: string; footballapi_player_id: number; minuts: number }[] = [],
    assists: { name: string; footballapi_player_id: number }[] = [],
    side: TeamSide,
  ) => {
    scorers.forEach((scorer, index) => {
      const scorerOption = createOption(scorer.footballapi_player_id, scorer.name);
      const assistSource = assists[index];
      const assistOption = assistSource
        ? createOption(assistSource.footballapi_player_id, assistSource.name)
        : null;

      events.push({
        minute: normalizeMinute(scorer.minuts),
        side,
        scorer: scorerOption,
        assist: assistOption,
      });
    });
  };

  build(game.home_team_scorer, game.home_team_assists, "HOME");
  build(game.away_team_scorer, game.away_team_assists, "AWAY");

  return sortGoalEvents(events);
};

const buildCardEventsFromGame = (game: Game): CardTimelineEvent[] => {
  const events: CardTimelineEvent[] = [];

  const createOption = (id: number | string | null | undefined, name: string): PlayerOption => ({
    value: String(id ?? name),
    label: name,
  });

  const build = (
    cards: { name: string; footballapi_player_id: number; minuts: number }[] = [],
    side: TeamSide,
    cardType: "YELLOW" | "RED",
  ) => {
    cards.forEach((card) => {
      events.push({
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

const normalizeMinute = (minute: number | null | undefined) => {
  const parsed = Number(minute);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parsePlayerId = (value: string | number | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default GameDetail;

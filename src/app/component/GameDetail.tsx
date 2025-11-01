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
import { ResultPreview } from "@/types/ResultPreview";
import MatchSummaryCard from "./MatchSummaryCard";
import GameResisterScorer from "./GameResisterScorer";
import { PlayerOption } from "@/types/PlayerOption";
import { SnackbarState } from "@/types/SnackbarState";
import { Squad } from "@/types/Squads";
import GameResisterCard from "./GameResisterCard";
import { ResultFormState } from "@/types/ResultFormState";
import GameResultConfirm from "./GameResultConfirm";

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

  const [resultPreview, setResultPreview] = useState<ResultPreview>({
    homeScore: 0,
    awayScore: 0,
    momName: "",
    momSide: null,
  });
  const [homePlayers, setHomePlayers] = useState<PlayerOption[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerOption[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isResultConfirmed, setIsResultConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/game?game_id=${game_id}`);
        const json = await res.json();

        if (json.success) {
          console.log(json.game);
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
      confirmed: Boolean(game.confirmed),
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

  const homeTeamName = game?.home_team_name ?? "ホームチーム";
  const awayTeamName = game?.away_team_name ?? "アウェイチーム";

  const goalResistered = (side: string) => {
    setResultPreview((prev) => ({
      ...prev,
      homeScore: prev.homeScore + (side === "HOME" ? 1 : 0),
      awayScore: prev.awayScore + (side === "AWAY" ? 1 : 0),
    }));
    setResultForm((prev) => ({
      ...prev,
    }));
  }

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
          {isResultConfirmed ? (
            <DisplayComments comments={comments} />
          ) : (
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
                <Tab label="コメント" />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <GameResisterScorer
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  onGoalRegistered={goalResistered}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <GameResisterCard
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <GameResultConfirm
                  game={game}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  setSnackbar={setSnackbar}
                  preview={resultPreview}
                  resultForm={resultForm}
                  setResultForm={setResultForm}
                  setResultPreview={setResultPreview}
                />
              </TabPanel>
              <TabPanel value={tab} index={3}>
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
  value: player.footballapi_player_id,
  label: player.player_name,
});

export default GameDetail;

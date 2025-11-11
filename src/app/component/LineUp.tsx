import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type LineUpEntry = {
  id: string;
  game_id: string;
  squad_id: string;
  rating: string | null;
  team_id: string | null;
  player_id: string | null;
  player_name: string;
  position: string | null;
  footballapi_player_id: string;
};

type Props = {
  gameId: string;
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  homeTeamName?: string | null;
  awayTeamName?: string | null;
};

const positionOrder = ["FW", "MF", "DF", "GK"] as const;
type StandardPosition = typeof positionOrder[number];
type GroupedLineups = Record<StandardPosition | "OTHER", LineUpEntry[]>;

const defaultPositionLabel: Record<StandardPosition | "OTHER", string> = {
  FW: "FW",
  MF: "MF",
  DF: "DF",
  GK: "GK",
  OTHER: "その他",
};

const getRatingValue = (rating?: string | null) => {
  if (rating === null || rating === undefined || rating === "") {
    return null;
  }
  const value = Number(rating);
  return Number.isFinite(value) ? value : null;
};

const getRatingColor = (rating: number | null) => {
  if (rating === null) return "grey.500";
  if (rating < 5) return "error.main";
  if (rating < 7) return "warning.main";
  return "success.main";
};

const createGroupedLineups = (): GroupedLineups => ({
  FW: [],
  MF: [],
  DF: [],
  GK: [],
  OTHER: [],
});

const groupByPosition = (entries: LineUpEntry[]): GroupedLineups => {
  const groups = createGroupedLineups();
  entries.forEach((entry) => {
    const pos = entry.position ?? "";
    const key = positionOrder.includes(pos as StandardPosition)
      ? (pos as StandardPosition)
      : "OTHER";
    groups[key].push(entry);
  });
  return groups;
};

export const LineUp = ({
  gameId,
  homeTeamId,
  awayTeamId,
  homeTeamName,
  awayTeamName,
}: Props) => {
  const [lineups, setLineups] = useState<LineUpEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setLineups([]);
      return;
    }

    const controller = new AbortController();

    const fetchLineup = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/game/v2/lineup?game_id=${gameId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok || json.success === false) {
          throw new Error(json?.message ?? "ラインナップの取得に失敗しました。");
        }
        const data: LineUpEntry[] = Array.isArray(json.data) ? json.data : [];
        setLineups(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setError(
          err instanceof Error ? err.message : "ラインナップの取得に失敗しました。"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLineup();

    return () => {
      controller.abort();
    };
  }, [gameId]);

  const { homeEntries, awayEntries, otherEntries } = useMemo(() => {
    const home: LineUpEntry[] = [];
    const away: LineUpEntry[] = [];
    const others: LineUpEntry[] = [];

    lineups.forEach((entry) => {
      if (homeTeamId && entry.team_id === homeTeamId) {
        home.push(entry);
        return;
      }
      if (awayTeamId && entry.team_id === awayTeamId) {
        away.push(entry);
        return;
      }
      others.push(entry);
    });

    return { homeEntries: home, awayEntries: away, otherEntries: others };
  }, [lineups, homeTeamId, awayTeamId]);

  const groupedHome = useMemo(() => groupByPosition(homeEntries), [homeEntries]);
  const groupedAway = useMemo(() => groupByPosition(awayEntries), [awayEntries]);
  const groupedOthers = useMemo(() => groupByPosition(otherEntries), [otherEntries]);

const renderPlayerCard = (player: LineUpEntry) => {
  const ratingValue = getRatingValue(player.rating);
  return (
    <Box
      key={player.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1,
        py: 1,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={
            player.player_id
              ? `https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`
              : undefined
          }
          alt={player.player_name}
          sx={{ width: 64, height: 64 }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            bgcolor: getRatingColor(ratingValue),
            color: "common.white",
            borderRadius: "12px",
            px: 0.75,
            py: 0.25,
            fontSize: "0.75rem",
            fontWeight: 600,
            minWidth: 36,
          }}
        >
          {ratingValue === null ? "--" : ratingValue.toFixed(1)}
        </Box>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {player.player_name}
      </Typography>
    </Box>
  );
};

const renderPositionStacks = (grouped: GroupedLineups) => (
    <Stack spacing={3}>
      {positionOrder.map((position) => {
        const players = grouped[position];
        if (!players.length) return null;
        return (
          <Box key={position}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
            >
              {defaultPositionLabel[position]}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={1.5}>
              {players.map(renderPlayerCard)}
            </Stack>
          </Box>
        );
      })}
      {grouped.OTHER.length > 0 && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
          >
            {defaultPositionLabel.OTHER}
          </Typography>
          <Divider sx={{ mb: 1 }} />
        <Stack spacing={1.5}>
          {grouped.OTHER.map(renderPlayerCard)}
        </Stack>
        </Box>
      )}
  </Stack>
);

  const renderTeamSection = (
    title: string,
    grouped: GroupedLineups,
    totalPlayers: number
  ) => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {totalPlayers === 0 ? (
        <Typography color="text.secondary">ラインナップが登録されていません。</Typography>
      ) : (
        renderPositionStacks(grouped)
      )}
    </Box>
  );

  const otherHasEntries = otherEntries.length > 0;

  return (
    <Card>
      <CardContent>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              minHeight: 160,
            }}
          >
            <CircularProgress size={32} />
            <Typography variant="body2">ラインナップを取得中...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : lineups.length === 0 ? (
          <Typography color="text.secondary" align="center">
            登録済みのラインナップがありません。
          </Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              {renderTeamSection(
                homeTeamName ?? "ホームチーム",
                groupedHome,
                homeEntries.length
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTeamSection(
                awayTeamName ?? "アウェイチーム",
                groupedAway,
                awayEntries.length
              )}
            </Grid>
            {otherHasEntries && (
              <Grid item xs={12}>
                {renderTeamSection(
                  "その他のチーム",
                  groupedOthers,
                  otherEntries.length
                )}
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

"use client";

import { Squad } from "@/types/Squads";
import { SnackbarState } from "@/types/SnackbarState";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

type InitialLineUp = {
  squad_id: string;
  rating?: number | null;
};

type Props = {
  gameId: string;
  homeSquads?: Squad[];
  awaySquads?: Squad[];
  initialLineups?: InitialLineUp[];
  loadingSquads?: boolean;
  onSubmitSuccess?: (response: unknown) => void;
};

type RatingMap = Record<string, string>;

type SideKey = "HOME" | "AWAY";

type SideConfig = {
  key: SideKey;
  label: string;
  squads: Squad[];
};

const defaultSnackbarState: SnackbarState = {
  open: false,
  message: "",
  severity: "success",
};

const toRatings = (lineups?: InitialLineUp[]): RatingMap => {
  if (!lineups?.length) return {};
  return lineups.reduce<RatingMap>((acc, lineup) => {
    if (typeof lineup.rating === "number" && !Number.isNaN(lineup.rating)) {
      acc[lineup.squad_id] = String(lineup.rating);
    }
    return acc;
  }, {});
};

const LineUpForm = ({
  gameId,
  homeSquads = [],
  awaySquads = [],
  initialLineups,
  loadingSquads = false,
  onSubmitSuccess,
}: Props) => {
  const [ratings, setRatings] = useState<RatingMap>(() => toRatings(initialLineups));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>(defaultSnackbarState);
  const [activeSide, setActiveSide] = useState<SideKey>(
    homeSquads.length > 0 ? "HOME" : "AWAY"
  );
  const ratingOptions = useMemo(() => {
    const values: string[] = [];
    for (let i = 0; i <= 20; i += 1) {
      values.push((i * 0.5).toFixed(1));
    }
    return values;
  }, []);

  const sideConfigs: SideConfig[] = useMemo(
    () => [
      { key: "HOME", label: "ホーム", squads: homeSquads },
      { key: "AWAY", label: "アウェイ", squads: awaySquads },
    ],
    [homeSquads, awaySquads]
  );

  useEffect(() => {
    setRatings((prev) => {
      const next: RatingMap = {};
      sideConfigs.forEach(({ squads }) => {
        squads.forEach((player) => {
          next[player.id] = prev[player.id] ?? "";
        });
      });
      return next;
    });
  }, [sideConfigs]);

  useEffect(() => {
    if (activeSide === "HOME" && homeSquads.length === 0 && awaySquads.length > 0) {
      setActiveSide("AWAY");
      return;
    }
    if (activeSide === "AWAY" && awaySquads.length === 0 && homeSquads.length > 0) {
      setActiveSide("HOME");
    }
  }, [activeSide, homeSquads.length, awaySquads.length]);

  useEffect(() => {
    if (!initialLineups?.length) return;
    setRatings((prev) => {
      const next = { ...prev };
      initialLineups.forEach((lineup) => {
        if (typeof lineup.rating === "number" && !Number.isNaN(lineup.rating)) {
          next[lineup.squad_id] = String(lineup.rating);
        }
      });
      return next;
    });
  }, [initialLineups]);

  const handleRatingChange = (squadId: string, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [squadId]: value,
    }));
  };

  const handleTabChange = (_: SyntheticEvent, value: SideKey) => {
    setActiveSide(value);
  };

  const validateForm = () => {
    if (!gameId) {
      return "game_id が指定されていません。";
    }
    const targetSquads = activeConfig?.squads ?? [];
    if (!targetSquads.length) {
      return "このタブには送信可能な選手がいません。";
    }
    const ratedPlayers = targetSquads.filter(
      (player) => ratings[player.id] && ratings[player.id] !== ""
    );
    if (ratedPlayers.length === 0) {
      return "レーティングを入力した選手がいません。";
    }
    const invalidRating = ratedPlayers.find((player) =>
      Number.isNaN(Number(ratings[player.id]))
    );
    if (invalidRating) {
      return "レーティングには数値を入力してください。";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const errorMessage = validateForm();
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }
    const targetSquadIds = new Set((activeConfig?.squads ?? []).map((player) => player.id));
    const lineups = Array.from(targetSquadIds)
      .filter((squadId) => ratings[squadId] && ratings[squadId] !== "")
      .map((squadId) => ({
        squad_id: squadId,
        rating: Number(ratings[squadId]),
      }));

    const payload = {
      game_id: gameId,
      lineups,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/game/v2/lineup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        const message =
          json?.message ??
          "ラインアップの登録に失敗しました。時間をおいて再度お試しください。";
        setFormError(message);
        return;
      }
      setSnackbar({
        open: true,
        message: "ラインアップを登録しました。",
        severity: "success",
      });
      setRatings((prev) => {
        const next = { ...prev };
        lineups.forEach((entry) => {
          next[entry.squad_id] = "";
        });
        return next;
      });
      onSubmitSuccess?.(json);
    } catch (error) {
      console.error(error);
      setFormError("ラインアップの登録中にエラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const renderSideList = (config: SideConfig) => {
    const { squads, label } = config;
    if (squads.length === 0) {
      return (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}の登録済み選手がいません。
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {squads.map((player) => (
          <Box
            key={player.id}
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              p: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                gap: 2,
                width: "100%",
              }}
            >
              <Avatar
                src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`}
                alt={player.player_name}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="body1" fontWeight={600}>
                {player.player_name}
              </Typography>
            </Box>
            <TextField
              select
              label="レーティング (任意)"
              value={ratings[player.id] ?? ""}
              onChange={(event) => handleRatingChange(player.id, event.target.value)}
              sx={{
                minWidth: { md: 160 },
                width: { xs: "100%", md: "auto" },
              }}
              SelectProps={{
                displayEmpty: true,
              }}
            >
              <MenuItem value="">
                <em>未入力</em>
              </MenuItem>
              {ratingOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        ))}
      </Stack>
    );
  };

  const hasAnySquad = sideConfigs.some((config) => config.squads.length > 0);
  const activeConfig = sideConfigs.find((config) => config.key === activeSide);

  return (
    <>
      <Card component="form" onSubmit={handleSubmit}>
        <CardHeader
          title="ラインアップ登録"
          subheader="各選手のレーティングを入力し、入力済みの選手のみ送信します。"
        />
        <CardContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {loadingSquads ? (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                gap: 2,
                justifyContent: "center",
                minHeight: 120,
              }}
            >
              <CircularProgress size={32} />
              <Typography variant="body2">選手情報を読み込み中...</Typography>
            </Box>
          ) : hasAnySquad && activeConfig ? (
            <Stack spacing={2}>
              <Tabs
                value={activeSide}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                {sideConfigs.map((config) => (
                  <Tab
                    key={config.key}
                    label={`${config.label} (${config.squads.length})`}
                    value={config.key}
                    disabled={config.squads.length === 0}
                  />
                ))}
              </Tabs>
              {renderSideList(activeConfig)}
            </Stack>
          ) : (
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                表示できる選手がいません。
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loadingSquads}
          >
            {submitting ? "送信中..." : "レーティングを送信"}
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LineUpForm;

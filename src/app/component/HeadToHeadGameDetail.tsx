import { Game } from "@/types/Game"
import { Avatar, Card, CardContent, Chip, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"

type Props = {
  game: Game
}

type HeadToHeadResult = {
  auth0_user_id: string
  opponent_auth0_user_id: string
  games_played: string
  wins: string
  draws: string
  losses: string
  match_scores: string[]
  match_is_home: boolean[]
}

export const HeadToHeadGameDetail = ({
  game
}: Props) => {

  const [headToHead, setHeadToHead] = useState<HeadToHeadResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchHead2Head = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/game/v2/headtohead?home_team_auth0_user_id=${game.home_team_auth0_user_id}&away_team_auth0_user_id=${game.away_team_auth0_user_id}`, {
          method: "GET"
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = await res.json();
        const payload: HeadToHeadResult | null = json?.data ?? json ?? null;
        if (!ignore) {
          setHeadToHead(payload);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("通算成績を取得できませんでした。");
          setHeadToHead(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchHead2Head();
    return () => {
      ignore = true;
    };
  }, [game.away_team_auth0_user_id, game.home_team_auth0_user_id]);

  const matchScores = Array.isArray(headToHead?.match_scores) ? headToHead!.match_scores : [];
  const matchFlags = Array.isArray(headToHead?.match_is_home) ? headToHead!.match_is_home : [];
  const matchDetails = matchScores.map((score, index) => ({
    score,
    isHome: Boolean(matchFlags[index]),
  }));

  const renderTeamAvatar = (type: "home" | "away", size: number = 32) => {
    const isHome = type === "home";
    const emblem = isHome ? game.home_team_emblem_url : game.away_team_emblem_url;
    const fallback = isHome ? game.home_team_name?.charAt(0) : game.away_team_name?.charAt(0);
    const label = isHome ? game.home_team_name : game.away_team_name;
    return (
      <Avatar
        src={emblem ?? undefined}
        alt={`${label ?? (isHome ? "home" : "away")} emblem`}
        sx={{ width: size, height: size }}
      >
        {fallback ?? "?"}
      </Avatar>
    );
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
          {renderTeamAvatar("home", 48)}
          <Stack spacing={1} alignItems="center">
            <Chip
              label={headToHead?.wins ?? "-"}
              sx={{ backgroundColor: "#E53935", color: "common.white", fontWeight: "bold" }}
            />
            <Typography variant="caption" color="text.secondary">
              Wins
            </Typography>
          </Stack>
          <Stack spacing={1} alignItems="center">
            <Chip
              label={headToHead?.draws ?? "-"}
              sx={{ backgroundColor: "#9E9E9E", color: "common.white", fontWeight: "bold" }}
            />
            <Typography variant="caption" color="text.secondary">
              Draws
            </Typography>
          </Stack>
          <Stack spacing={1} alignItems="center">
            <Chip
              label={headToHead?.losses ?? "-"}
              sx={{ backgroundColor: "#1E88E5", color: "common.white", fontWeight: "bold" }}
            />
            <Typography variant="caption" color="text.secondary">
              Wins
            </Typography>
          </Stack>
          {renderTeamAvatar("away", 48)}
        </Stack>
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              取得中...
            </Typography>
          </Stack>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : headToHead ? (
          <Stack spacing={3}>
            <Stack spacing={1}>
              {matchDetails.length === 0 ? (
                <Typography variant="body2">試合結果がありません。</Typography>
              ) : (
                matchDetails.map((match, index) => {
                  const homeName = match.isHome ? game.home_team_name : game.away_team_name;
                  const awayName = match.isHome ? game.away_team_name : game.home_team_name;
                  const homeAvatar = match.isHome ? renderTeamAvatar("home") : renderTeamAvatar("away");
                  const awayAvatar = match.isHome ? renderTeamAvatar("away") : renderTeamAvatar("home");
                  return (
                    <Stack
                      key={`${match.score}-${index}`}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justifyContent="center"
                    >
                      <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
                        {homeName}
                      </Typography>
                      <Stack flex={1} alignItems="center">
                        {homeAvatar}
                      </Stack>
                      <Typography variant="body1" fontWeight="bold" sx={{ flex: 1, textAlign: "center" }}>
                        {match.score}
                      </Typography>
                      <Stack flex={1} alignItems="center">
                        {awayAvatar}
                      </Stack>
                      <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
                        {awayName}
                      </Typography>
                    </Stack>
                  );
                })
              )}
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            通算成績が見つかりませんでした。
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

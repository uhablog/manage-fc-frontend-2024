import { Game } from "@/types/Game";
import { TeamGame } from "@/types/TeamGames";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  game: Game
}

export const TeamForm = ({
  game
}: Props) => {

  const [ homeTeamGames, setHomeTeamGames ] = useState<TeamGame[]>([]);
  const [ awayTeamGames, setAwayTeamGames ] = useState<TeamGame[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {

    const fetchTeamGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ homeRes, awayRes ] = await Promise.all([
          fetch(`/api/team/games?team_id=${game.home_team_id}&limit=5`),
          fetch(`/api/team/games?team_id=${game.away_team_id}&limit=5`)
        ]);

        if (!homeRes.ok || !awayRes.ok) {
          throw new Error("team games fetch failed");
        }

        const homeJson = await homeRes.json();
        const awayJson = await awayRes.json();

        if (homeJson?.success === false || awayJson?.success === false) {
          throw new Error("team games fetch returned error");
        }

        const homeData = Array.isArray(homeJson?.data) ? homeJson.data : [];
        const awayData = Array.isArray(awayJson?.data) ? awayJson.data : [];

        setHomeTeamGames(homeData);
        setAwayTeamGames(awayData);
      } catch (err) {
        console.error("failed to fetch team form", err);
        setHomeTeamGames([]);
        setAwayTeamGames([]);
        setError("試合情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamGames();

  }, [game.home_team_id, game.away_team_id]);

  const renderTeamFormColumn = (games: TeamGame[], teamId: string) => {
    if (!games.length) {
      return (
        <Stack spacing={1} flex={1} minWidth={0}>
          <Typography variant="body2" color="text.secondary">直近の試合がありません。</Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={1} flex={1} minWidth={0}>
        {games.map((teamGame) => {
          const isHomeTeam = teamGame.home_team_id === teamId;
          const teamEmblem = isHomeTeam ? teamGame.home_team_emblem_url : teamGame.away_team_emblem_url;
          const opponentEmblem = isHomeTeam ? teamGame.away_team_emblem_url : teamGame.home_team_emblem_url;
          const parsedTeamScore = Number(isHomeTeam ? teamGame.home_team_score : teamGame.away_team_score);
          const parsedOpponentScore = Number(isHomeTeam ? teamGame.away_team_score : teamGame.home_team_score);
          const teamScore = Number.isFinite(parsedTeamScore) ? parsedTeamScore : 0;
          const opponentScore = Number.isFinite(parsedOpponentScore) ? parsedOpponentScore : 0;
          const result: "W" | "D" | "L" =
            teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "D";
          const scoreBgColor =
            result === "W" ? "success.light" : result === "L" ? "error.light" : "grey.200";

          const teamAvatar = (
            <Avatar
              src={teamEmblem ?? undefined}
              alt="team emblem"
              sx={{ width: 32, height: 32, flexShrink: 0 }}
            >
              {(isHomeTeam ? teamGame.home_team_name : teamGame.away_team_name)?.charAt(0) ?? "?"}
            </Avatar>
          );

          const opponentAvatar = (
            <Avatar
              src={opponentEmblem ?? undefined}
              alt="opponent emblem"
              sx={{ width: 32, height: 32, flexShrink: 0 }}
            >
              {(isHomeTeam ? teamGame.away_team_name : teamGame.home_team_name)?.charAt(0) ?? "?"}
            </Avatar>
          );

          return (
            <Box
              key={teamGame.id}
              sx={{
                alignItems: "center",
                display: "flex",
                gap: 1,
                px: 1,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {isHomeTeam ? teamAvatar : opponentAvatar}
              <Box
                sx={{
                  bgcolor: scoreBgColor,
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.5,
                  minWidth: 68,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {teamGame.home_team_score} - {teamGame.away_team_score}
                </Typography>
              </Box>
              {isHomeTeam ? opponentAvatar : teamAvatar}
            </Box>
          );
        })}
      </Stack>
    );
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" align="center">Team Form</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {loading ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                }}
              >
                {renderTeamFormColumn(homeTeamGames, game.home_team_id)}
                {renderTeamFormColumn(awayTeamGames, game.away_team_id)}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  )
};

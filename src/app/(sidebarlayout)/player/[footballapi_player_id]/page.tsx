import {
  Avatar,
  Card,
  CardContent,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PlayerConventionStats } from "@/types/PlayerConventionStats";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import NextLink from "next/link";

export default withPageAuthRequired(async function PlayerPage({ params, searchParams }: any) {
  const footballapi_player_id = params.footballapi_player_id as string;
  const convention_id = (searchParams?.convention_id as string) || "";
  const accessTokenResult = await getAccessToken();

  if (!accessTokenResult?.accessToken) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          認証情報が見つかりません
        </Typography>
      </Container>
    );
  }

  const response = await fetch(
    `${process.env.API_ENDPOINT}/api/players/${footballapi_player_id}/stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessTokenResult.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          プレイヤー情報の取得に失敗しました
        </Typography>
      </Container>
    );
  }

  const stats: PlayerConventionStats[] = await response.json();

  if (!stats || stats.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">プレイヤー情報が見つかりません</Typography>
      </Container>
    );
  }

  // 最初のエントリから基本情報を取得
  const playerInfo = stats[0];
  const birthDate = new Date(playerInfo.birth_date);
  const formattedBirthDate = birthDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 年齢を計算
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthDate);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 戻るボタン */}
      <Button
        component={NextLink}
        href={convention_id ? `/conventions/${convention_id}` : "/conventions"}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        戻る
      </Button>

      {/* プレイヤーヘッダー */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {/* アイコン + 名前セクション */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Avatar
              src={`https://media.api-sports.io/football/players/${footballapi_player_id}.png`}
              alt={playerInfo.player_name}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {playerInfo.player_name}
            </Typography>
          </Stack>

          {/* プロフィール情報 */}
          <Stack spacing={3}>
            {/* 身長・体重 */}
            <Stack direction="row" spacing={4}>
              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  身長
                </Typography>
                <Typography variant="body1">{playerInfo.height}</Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  体重
                </Typography>
                <Typography variant="body1">{playerInfo.weight}</Typography>
              </Box>
            </Stack>

            {/* 生年月日・国籍 */}
            <Stack direction="row" spacing={4}>
              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  生年月日（年齢）
                </Typography>
                <Typography variant="body1">{formattedBirthDate} ({age}歳)</Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  国籍
                </Typography>
                <Typography variant="body1">{playerInfo.nationality}</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* 大会別スタッツテーブル */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            キャリア
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>大会</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    ゴール
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    アシスト
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((stat, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <TableCell>{stat.convention_name}</TableCell>
                    <TableCell align="center">{stat.goals}</TableCell>
                    <TableCell align="center">{stat.assists}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 合計行 */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "2px solid #bdbdbd",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              合計
            </Typography>
            <Box sx={{ display: "flex", gap: 8 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  ゴール
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {stats.reduce((sum, stat) => sum + parseInt(stat.goals || "0"), 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  アシスト
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {stats.reduce((sum, stat) => sum + parseInt(stat.assists || "0"), 0)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}, { returnTo: '/conventions' });

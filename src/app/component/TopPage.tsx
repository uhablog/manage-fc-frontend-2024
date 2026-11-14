"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/image";
import NextLink from "next/link";
import topPageDetailImage from "../../../public/maemob-toppage-3.png";
import topPageImage from "../../../public/maemob-toppage.webp";

const valueProps = [
  {
    title: "大会運営をひとつに",
    description: "大会作成、チーム登録、試合進行を1つの画面遷移で管理できます。",
    icon: <EmojiEventsRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
  },
  {
    title: "試合結果をすばやく記録",
    description: "得点、カード、MOM、PKストップまで現場でそのまま入力できます。",
    icon: <SportsSoccerRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
  },
  {
    title: "個人とチームの成績を可視化",
    description: "得点・アシスト・失点率などをランキングで振り返れます。",
    icon: <InsightsRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
  },
];

const steps = [
  {
    title: "ユーザー登録してログイン",
    description: "Auth0認証ですぐに利用開始。チーム運営者ごとに安全に管理できます。",
  },
  {
    title: "大会とチームを登録",
    description: "大会を作成し、参加チームや所属選手の情報を整理します。",
  },
  {
    title: "試合結果を入力して共有",
    description: "試合ごとの記録がそのまま集計され、ランキングや戦績に反映されます。",
  },
];

const featurePoints = [
  {
    title: "対戦結果の記録",
    description: "スコア、コメント、試合詳細まで記録して大会の履歴を残せます。",
    icon: <TimelineRoundedIcon color="primary" sx={{ fontSize: 28 }} />,
  },
  {
    title: "チーム・選手情報の整理",
    description: "チーム単位でも選手単位でも、見たい情報へすぐアクセスできます。",
    icon: <Groups2RoundedIcon color="primary" sx={{ fontSize: 28 }} />,
  },
  {
    title: "運営しやすい集計画面",
    description: "ランキングや成績表示が揃っているので、運営の手間を減らせます。",
    icon: <VerifiedRoundedIcon color="primary" sx={{ fontSize: 28 }} />,
  },
];

export const TopPageComponent = () => {
  return (
    <Box sx={{ bgcolor: "#f7fafc", color: "#0f172a" }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(10px)", bgcolor: "rgba(247, 250, 252, 0.9)", borderBottom: "1px solid #e2e8f0" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              MaeMob
            </Typography>
            <Button
              component={NextLink}
              href={`/auth/login?returnTo=/conventions`}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              ログインして始める
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">
        <Box
          sx={{
            background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 48%, #f7fafc 100%)",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
            <Grid2 container spacing={6} alignItems="center">
              <Grid2 xs={12} md={6}>
                <Stack spacing={3}>
                  <Chip label="FC24の大会・試合管理をスムーズに" color="primary" sx={{ width: "fit-content", fontWeight: 600 }} />
                  <Typography component="h1" variant="h2" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                    サッカー大会の運営を、
                    <Box component="span" sx={{ color: "primary.main", display: "block" }}>
                      もっとシンプルに。
                    </Box>
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    MaeMobは、大会登録・試合結果入力・個人成績の集計までを一元化する運営向けアプリです。
                    現場で記録しやすく、あとから見返しやすい体験に整えています。
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      component={NextLink}
                      href="/auth/login?returnTo=/conventions"
                      size="large"
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      無料で始める
                    </Button>
                    <Button component={NextLink} href="#features" size="large" variant="outlined">
                      機能を見る
                    </Button>
                  </Stack>
                </Stack>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <Box
                  sx={{
                    overflow: "hidden",
                    borderRadius: 6,
                    border: "1px solid #dbeafe",
                    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Image src={topPageImage} alt="MaeMobのトップイメージ" priority style={{ width: "100%", height: "auto", display: "block" }} />
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
          <Grid2 container spacing={3}>
            {valueProps.map((item) => (
              <Grid2 xs={12} md={4} key={item.title}>
                <Card sx={{ height: "100%", borderRadius: 4, boxShadow: "none", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                      {item.icon}
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {item.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Container>

        <Box id="features" sx={{ bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
            <Grid2 container spacing={6} alignItems="center">
              <Grid2 xs={12} md={5}>
                <Stack spacing={2.5}>
                  <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                    Features
                  </Typography>
                  <Typography component="h2" variant="h3" sx={{ fontWeight: 800 }}>
                    日々の運営に必要な情報へ、
                    迷わずたどり着けます。
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
                    MaeMobは入力しやすさだけでなく、運営後の振り返りにも強い構成です。大会・チーム・選手の情報が整理され、必要なデータをすばやく確認できます。
                  </Typography>
                  <Stack spacing={2} sx={{ pt: 1 }}>
                    {featurePoints.map((item) => (
                      <Stack direction="row" spacing={2} alignItems="flex-start" key={item.title}>
                        <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {item.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid2>
              <Grid2 xs={12} md={7}>
                <Box
                  sx={{
                    overflow: "hidden",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Image src={topPageDetailImage} alt="MaeMobの画面イメージ" style={{ width: "100%", height: "auto", display: "block" }} />
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
          <Stack spacing={2} sx={{ mb: 4, textAlign: { xs: "left", md: "center" } }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
              How It Works
            </Typography>
            <Typography component="h2" variant="h3" sx={{ fontWeight: 800 }}>
              導入は3ステップです。
            </Typography>
          </Stack>
          <Grid2 container spacing={3}>
            {steps.map((step, index) => (
              <Grid2 xs={12} md={4} key={step.title}>
                <Card sx={{ height: "100%", borderRadius: 4, boxShadow: "none", border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                      <Typography color="primary.main" sx={{ fontWeight: 800 }}>
                        STEP {index + 1}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {step.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Container>

        <Box sx={{ bgcolor: "#0f172a", color: "#ffffff" }}>
          <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 }, textAlign: "center" }}>
            <Stack spacing={3} alignItems="center">
              <Typography component="h2" variant="h3" sx={{ fontWeight: 800 }}>
                大会運営を、記録から共有までスムーズに。
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.76)", lineHeight: 1.9 }}>
                まずはログインして大会を作成し、MaeMobの管理フローを体験してください。
              </Typography>
              <Button
                component={NextLink}
                href="/auth/login?returnTo=/conventions"
                size="large"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                ログインして大会管理を始める
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Box component="footer" sx={{ bgcolor: "#020617", color: "rgba(255, 255, 255, 0.72)", py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            ©2024 MaeMob
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

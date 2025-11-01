import { grey } from "@mui/material/colors";
import { ResultPreview } from "@/types/ResultPreview";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { TeamSummaryDetailGame } from "./TeamSummaryDetailGame";

export default function MatchSummaryCard({
  homeTeamName,
  awayTeamName,
  homeEmblem,
  awayEmblem,
  preview,
}: {
  homeTeamName: string;
  awayTeamName: string;
  homeEmblem?: string | null;
  awayEmblem?: string | null;
  preview: ResultPreview;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 xs={4} md={4}>
            <TeamSummaryDetailGame
              label={homeTeamName}
              emblem={homeEmblem}
              align="right"
              color="success.main"
            />
          </Grid2>
          <Grid2 xs={4} md={4}>
            <Stack spacing={1} alignItems="center">
              <Typography variant="h4">
                {preview.homeScore} - {preview.awayScore}
              </Typography>
              <Typography variant="body2" color={grey[600]}>
                MOM: {preview.momName || "未選択"}
              </Typography>
            </Stack>
          </Grid2>
          <Grid2 xs={4} md={4}>
            <TeamSummaryDetailGame
              label={awayTeamName}
              emblem={awayEmblem}
              align="left"
              color="primary.main"
            />
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  )
}
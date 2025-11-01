import { ResultPreview } from "@/types/ResultPreview";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export const ResultPreviewCard = ({
  homeTeamName,
  awayTeamName,
  preview,
  note,
}: {
  homeTeamName: string;
  awayTeamName: string;
  preview: ResultPreview;
  note: string;
}) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        現在のプレビュー
      </Typography>
      <Stack spacing={1}>
        <Typography variant="h5">
          {homeTeamName} {preview.homeScore} - {preview.awayScore} {awayTeamName}
        </Typography>
        <Typography variant="body2" color={grey[600]}>
          MOM: {preview.momName || "未選択"}
        </Typography>
        <Typography variant="body2" color={grey[600]}>
          備考: {note || "入力なし"}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);
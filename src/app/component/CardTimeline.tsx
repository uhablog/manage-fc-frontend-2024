import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { TimelineEmpty } from "./TimeLineEmpty";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";

export const CardTimeline = ({
  events,
  homeTeamName,
  awayTeamName,
}: {
  events: CardTimelineEvent[];
  homeTeamName: string;
  awayTeamName: string;
}) => {
  if (events.length === 0) {
    return <TimelineEmpty message="まだカードが登録されていません。" />;
  }

  return (
    <Stack spacing={1.5}>
      {events.map((event) => {
        const teamName = event.side === "HOME" ? homeTeamName : awayTeamName;
        return (
          <Card key={event.id} variant="outlined" sx={{ borderColor: grey[200] }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`${event.minute}'`} size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{event.player.label}</Typography>
                  <Typography variant="body2" color={grey[600]}>
                    {teamName}
                    {event.note ? ` / 備考: ${event.note}` : ""}
                  </Typography>
                </Box>
                <SquareRoundedIcon
                  fontSize="small"
                  sx={{
                    color: event.cardType === "YELLOW" ? "#fbc02d" : "#d32f2f",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

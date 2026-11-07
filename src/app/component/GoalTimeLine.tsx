import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { TimelineEmpty } from "./TimeLineEmpty";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { grey } from "@mui/material/colors";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { EventActionButtons } from "./EventActionButtons";


export const GoalTimeline = ({
  events,
  homeTeamName,
  awayTeamName,
  onEdit,
  onDelete,
}: {
  events: GoalTimelineEvent[];
  homeTeamName: string;
  awayTeamName: string;
  onEdit?: (event: GoalTimelineEvent) => void;
  onDelete?: (event: GoalTimelineEvent) => Promise<void>;
}) => {
  if (events.length === 0) {
    return <TimelineEmpty message="まだ得点が登録されていません。" />;
  }

  const sortedEvents = [...events].sort((a, b) => {
    const minuteA = Number.isFinite(a.minute) ? a.minute : 0;
    const minuteB = Number.isFinite(b.minute) ? b.minute : 0;
    if (minuteA === minuteB) {
      return a.side === "HOME" && b.side === "AWAY" ? -1 : 1;
    }
    return minuteA - minuteB;
  });

  return (
    <Stack spacing={1.5}>
      {sortedEvents.map((event) => {
        const teamName = event.side === "HOME" ? homeTeamName : awayTeamName;
        return (
          <Card key={event.id} variant="outlined" sx={{ borderColor: grey[200] }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`${event.minute}'`} size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {event.scorer.label}
                    {event.scorer.isOwnGoal ? " (OG)" : ""}
                  </Typography>
                  <Typography variant="body2" color={grey[600]}>
                    {event.assist ? `Assist: ${event.assist.label} / ` : ""}
                    {teamName}
                  </Typography>
                </Box>
                <SportsSoccerIcon
                  fontSize="small"
                  color={event.side === "HOME" ? "success" : "primary"}
                />
                {onEdit && onDelete && (
                  <EventActionButtons
                    eventLabel={`${event.minute}分 ${event.scorer.label}の得点`}
                    onEdit={() => onEdit(event)}
                    onDelete={() => onDelete(event)}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

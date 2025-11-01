import { Card, CardContent, Chip, Divider, Stack, Typography, Box } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { grey } from "@mui/material/colors";
import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { TimelineEmpty } from "./TimeLineEmpty";
import type { ReactNode } from "react";

type Props = {
  goalEvents: GoalTimelineEvent[];
  cardEvents: CardTimelineEvent[];
  homeTeamName: string;
  awayTeamName: string;
};

type FlowEvent = {
  minute: number;
  side: TeamSide;
  type: "GOAL" | "CARD";
  title: string;
  description?: string;
  cardType?: "YELLOW" | "RED";
};

const GameFlowTimeline = ({ goalEvents, cardEvents, homeTeamName, awayTeamName }: Props) => {
  const combinedEvents = buildFlowEvents(goalEvents, cardEvents, homeTeamName, awayTeamName);

  if (combinedEvents.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            試合の流れ
          </Typography>
          <TimelineEmpty message="まだイベントが登録されていません。" />
        </CardContent>
      </Card>
    );
  }

  const rendered: ReactNode[] = [];
  const halfTimeIndex = combinedEvents.findIndex((event) => event.minute > 45);

  combinedEvents.forEach((event, index) => {
    if (halfTimeIndex !== -1 && index === halfTimeIndex) {
      rendered.push(
        <Divider key="half-time" textAlign="center">
          <Typography variant="caption" color={grey[600]}>
            ハーフタイム
          </Typography>
        </Divider>
      );
    }

    rendered.push(<EventCard key={`event-${index}`} event={event} />);
  });

  if (halfTimeIndex === -1) {
    rendered.push(
      <Divider key="half-time" textAlign="center">
        <Typography variant="caption" color={grey[600]}>
          ハーフタイム
        </Typography>
      </Divider>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          試合の流れ
        </Typography>
        <Stack spacing={1.5}>{rendered}</Stack>
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event }: { event: FlowEvent }) => {
  const isHome = event.side === "HOME";
  const icon = event.type === "GOAL" ? (
    <SportsSoccerIcon fontSize="small" color={isHome ? "success" : "primary"} />
  ) : (
    <SquareRoundedIcon
      fontSize="small"
      sx={{ color: event.cardType === "YELLOW" ? "#fbc02d" : "#d32f2f" }}
    />
  );

  const content = (
    <Stack spacing={0.5} sx={{ textAlign: isHome ? "left" : "right" }}>
      <Typography variant="subtitle1">{event.title}</Typography>
      {event.description && (
        <Typography variant="body2" color={grey[600]}>
          {event.description}
        </Typography>
      )}
    </Stack>
  );

  const minuteChip = <Chip label={`${event.minute}'`} size="small" />;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isHome ? "flex-start" : "flex-end",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent={isHome ? "flex-start" : "flex-end"}
        sx={{ maxWidth: 360, width: "100%" }}
      >
        {isHome ? (
          <>
            {minuteChip}
            {icon}
            <Box sx={{ flex: 1 }}>{content}</Box>
          </>
        ) : (
          <>
            <Box sx={{ flex: 1 }}>{content}</Box>
            {icon}
            {minuteChip}
          </>
        )}
      </Stack>
    </Box>
  );
};

const buildFlowEvents = (
  goals: GoalTimelineEvent[],
  cards: CardTimelineEvent[],
  _homeTeamName: string,
  _awayTeamName: string,
): FlowEvent[] => {
  const goalItems: FlowEvent[] = goals.map((goal) => {
    const descriptionParts: string[] = [];
    if (goal.assist) {
      descriptionParts.push(`Assist: ${goal.assist.label}`);
    }
    return {
      minute: normalizeMinute(goal.minute),
      side: goal.side,
      type: "GOAL",
      title: `${goal.scorer.label}${goal.scorer.isOwnGoal ? " (OG)" : ""}`,
      description: descriptionParts.length > 0 ? descriptionParts.join(" / ") : undefined,
    };
  });

  const cardItems: FlowEvent[] = cards.map((card) => {
    return {
      minute: normalizeMinute(card.minute),
      side: card.side,
      type: "CARD",
      cardType: card.cardType,
      title: card.player.label,
      description: card.note || undefined,
    };
  });

  return [...goalItems, ...cardItems].sort((a, b) => {
    const diff = a.minute - b.minute;
    if (diff !== 0) return diff;
    if (a.type === b.type) {
      return a.side === "HOME" && b.side === "AWAY" ? -1 : 1;
    }
    return a.type === "GOAL" ? -1 : 1;
  });
};

const normalizeMinute = (minute: number | null | undefined) => {
  const parsed = Number(minute);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default GameFlowTimeline;

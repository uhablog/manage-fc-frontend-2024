import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import GameFlowTimeline from "./GameFlowTimeline";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { Game } from "@/types/Game";
import { TeamForm } from "./TeamForm";
import { PenaltyStopTimelineEvent } from "@/types/PenaltyStopTimelineEvent";

type Props = {
  goalEvents: GoalTimelineEvent[];
  cardEvents: CardTimelineEvent[];
  penaltyStopEvents: PenaltyStopTimelineEvent[];
  game: Game
};

export const Facts = ({
  goalEvents,
  cardEvents,
  penaltyStopEvents,
  game
}: Props) => {
  return (
    <>
      <GameFlowTimeline
        goalEvents={goalEvents}
        cardEvents={cardEvents}
        penaltyStopEvents={penaltyStopEvents}
        homeTeamName={game.home_team_name}
        awayTeamName={game.away_team_name}
      />
      <TeamForm
        game={game}
      />
    </>
  )
};

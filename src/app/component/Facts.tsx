import { GoalTimelineEvent } from "@/types/GoalTimelineEvent";
import GameFlowTimeline from "./GameFlowTimeline";
import { CardTimelineEvent } from "@/types/CardTimelineEvent";
import { Game } from "@/types/Game";
import { TeamForm } from "./TeamForm";

type Props = {
  goalEvents: GoalTimelineEvent[];
  cardEvents: CardTimelineEvent[];
  game: Game
};

export const Facts = ({
  goalEvents,
  cardEvents,
  game
}: Props) => {
  return (
    <>
      <GameFlowTimeline
        goalEvents={goalEvents}
        cardEvents={cardEvents}
        homeTeamName={game.home_team_name}
        awayTeamName={game.away_team_name}
      />
      <TeamForm
        game={game}
      />
    </>
  )
};
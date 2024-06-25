import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import TeamGamesCard from "./TeamGamesCard";
import { TeamScorerRank } from "./TeamScorerRank";
import { Team } from "@/types/Team";
import { TeamData } from "./TeamData";
import { TeamAssistRank } from "./TeamAssistRank";
import { TeamGARank } from "./TeamGARank";
import { TeamMomRank } from "./TeamMomRank";

type Props = {
  team_id: string
  team_data: Team
}
const TeamSummary = ({
  team_id,
  team_data
}: Props) => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={6}>
          <TeamGamesCard team_id={team_id}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TeamData team_data={team_data}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TeamScorerRank team_id={team_id}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TeamAssistRank team_id={team_id}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TeamGARank team_id={team_id}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TeamMomRank team_id={team_id}/>
        </Grid2>
      </Grid2>
    </>
  )
};

export default TeamSummary;
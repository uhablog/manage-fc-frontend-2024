import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DisplayTeams from "./DisplayTeams";
import DisplayScorer from "./DisplayScorer";
import DisplayGames from "./DisplayGames";
import { Typography } from "@mui/material";
import DisplayAssistRankCard from "./DisplayAssistRankCard";
import DisplayGARankCard from "./DisplayGARankCard";
import DisplayMomRankCard from "./DisplayMomRankCard";
import DisplayYellowCardRank from "./DisplayYellowCardRank";
import DisplayRedCardRank from "./DisplayRedCardRank";

type Props = {
  id: string
}

const ConventionSummary = ({id}: Props) => {

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={8}>
          <DisplayTeams id={id}/>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayGames convention_id={id} initialLimit={5} addButtonDisplay={false} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayScorer id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayAssistRankCard id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayGARankCard id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayMomRankCard id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayYellowCardRank id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <DisplayRedCardRank id={id} initialLimit={5} />
        </Grid2>
      </Grid2>
    </>
  )
};

export default ConventionSummary;
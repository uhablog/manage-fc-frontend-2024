import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DisplayTeams from "./DisplayTeams";
import DisplayScorer from "./DisplayScorer";
import DisplayGames from "./DisplayGames";
import { Typography } from "@mui/material";
import DisplayAssistRankCard from "./DisplayAssistRankCard";
import DisplayGARankCard from "./DisplayGARankCard";
import DisplayMomRankCard from "./DisplayMomRankCard";
import DisplayYellowCardRank from "./DisplayYellowCardRank";

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
          <DisplayGames convention_id={id} initialLimit={5} />
        </Grid2>
        <Grid2 xs={12} md={8}>
          <Typography variant="h6" component="p">得点ランク</Typography>
          <DisplayScorer id={id} initialLimit={5} />
          <Typography variant="h6" component="p">アシストランク</Typography>
          <DisplayAssistRankCard id={id} initialLimit={5} />
          <Typography variant="h6" component="p">G+Aランク</Typography>
          <DisplayGARankCard id={id} initialLimit={5} />
          <Typography variant="h6" component="p">MOMランク</Typography>
          <DisplayMomRankCard id={id} initialLimit={5} />
          <Typography variant="h6" component="p">イエローカードランク</Typography>
          <DisplayYellowCardRank id={id} initialLimit={5} />
        </Grid2>
      </Grid2>
    </>
  )
};

export default ConventionSummary;
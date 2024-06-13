import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DisplayTeams from "./DisplayTeams";
import DisplayScorer from "./DisplayScorer";
import DisplayGames from "./DisplayGames";
import { Typography } from "@mui/material";

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
          <Typography variant="h6">日程</Typography>
          <DisplayGames convention_id={id} />
        </Grid2>
        <Grid2 xs={12} md={8}>
          <Typography variant="h6">得点王</Typography>
          <DisplayScorer id={id}/>
        </Grid2>
      </Grid2>
    </>
  )
};

export default ConventionSummary;
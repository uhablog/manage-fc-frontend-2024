import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import DisplayScorer from "./DisplayScorer"
import { Typography } from "@mui/material"
import DisplayAssistRankCard from "./DisplayAssistRankCard"
import DisplayMomRankCard from "./DisplayMomRankCard"
import DisplayGARankCard from "./DisplayGARankCard"
import DisplayYellowCardRank from "./DisplayYellowCardRank"
import DisplayRedCardRank from "./DisplayRedCardRank"

type Props = {
  convention_id: string
}

const StatsGrid = ({convention_id}: Props) => {
  return (
    <Grid2 container spacing={1}>
      <Grid2 xs={12} md={6}>
        <DisplayScorer id={convention_id} initialLimit={5} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <DisplayAssistRankCard id={convention_id} initialLimit={5} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <DisplayGARankCard id={convention_id} initialLimit={5} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <DisplayMomRankCard id={convention_id} initialLimit={5} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <DisplayYellowCardRank id={convention_id} initialLimit={5} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <DisplayRedCardRank id={convention_id} initialLimit={5} />
      </Grid2>
    </Grid2>
  )
}

export default StatsGrid;
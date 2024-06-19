import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  user_id: string
}
const Squad = ({user_id}: Props) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Typography>Squad Page</Typography>
      </Grid2>
    </Grid2>
  )
};

export default Squad;
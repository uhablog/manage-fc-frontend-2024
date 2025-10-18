import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import UserTotalStats from "./UserTotalStats";
import UserTopScorer from "./UserTopScorer";
import UserEmblem from "./UserEmblem";

type Props = {
  user_id: string
}

const UserSummary = ({user_id}: Props) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12}>
        <UserEmblem userId={user_id} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <UserTotalStats user_id={user_id} />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <UserTopScorer user_id={user_id} />
      </Grid2>
    </Grid2>
  )
};
export default UserSummary;

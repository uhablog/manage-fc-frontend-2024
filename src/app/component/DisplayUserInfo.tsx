import UserTotalStats from "./UserTotalStats";
import ProfileCard from "./ProfileCard";
import UserTopScorer from "./UserTopScorer";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import CustomTabPanel from "./CustomTabPanel";
import Squad from "./Squad";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import UserSummary from "./UserSummary";

type Props = {
  user: UserProfile
}

const DisplayUserInfo = ({ user }: Props) => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    user.sub && (
      <>
        <Grid2 container spacing={1}>
          <Grid2 xs={12}>
            <ProfileCard user={user} value={value} handleChange={handleChange} />
            <CustomTabPanel value={value} index={0}>
              <UserSummary user_id={user.sub} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Squad user_id={user.sub} />
            </CustomTabPanel>
          </Grid2>
        </Grid2>
      </>
    )
  )
};

export default DisplayUserInfo;
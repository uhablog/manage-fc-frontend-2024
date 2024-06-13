import { Claims } from "@auth0/nextjs-auth0";
import { Box, Container, Grid } from "@mui/material";
import UserTotalStats from "./UserTotalStats";
import ProfileCard from "./ProfileCard";
import Head2Head from "./Head2Head";
import UserTopScorer from "./UserTopScorer";

type Props = {
  user: Claims
}

const DisplayUserInfo = ({ user }: Props) => {

  return (
    <>
      <Container>
        <Box sx={{ my: 4 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
              <ProfileCard user={user} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <UserTotalStats user_id={user.sub} />
            </Grid>
            <Grid item xs={12} md={6} >
              <UserTopScorer user_id={user.sub}/>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
};

export default DisplayUserInfo;
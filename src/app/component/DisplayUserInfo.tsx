import { Team } from "@/types/Team";
import { Claims, getAccessToken } from "@auth0/nextjs-auth0";
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";

type Props = {
  user: Claims
}

type TeamStats = {
  win: number;
  draw: number;
  lose: number;
  totalScore: number;
  games: number;
}


const DisplayUserInfo = async ({ user }: Props) => {

  const accessTokenResult = await getAccessToken();

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/grade?user_id=${user.sub}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();
  console.log(json);

  const totals = json.data.reduce((acc: TeamStats, item: Team) => ({
    win: acc.win + item.win,
    draw: acc.draw + item.draw,
    lose: acc.lose + item.lose,
    totalScore: acc.totalScore + item.totalScore,
    games: acc.games + item.games,
  }), { win: 0, draw: 0, lose: 0, totalScore: 0, games: 0 });

  return (
    <>
      <Container>
        <Box sx={{ my: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <Card>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={200}
                    height={200}
                    style={{ borderRadius: '50%' }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h5" component="div">{user.name}</Typography>
                  <Typography color="text.secondary">{user.email}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" href="/api/auth/logout" variant="contained" color="primary">
                    Logout
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
              <Card raised>
                <CardContent>
                  <Typography variant="h6" gutterBottom>通算成績</Typography>
                  <Typography variant="body2">通算勝利: {totals.win}</Typography>
                  <Typography variant="body2">通算引分: {totals.draw}</Typography>
                  <Typography variant="body2">通算敗北: {totals.lose}</Typography>
                  <Typography variant="body2">通算試合: {totals.games}</Typography>
                  <Typography variant="body2">通算得点: {totals.totalScore}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
};

export default DisplayUserInfo;
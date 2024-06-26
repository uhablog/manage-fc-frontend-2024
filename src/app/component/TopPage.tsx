import { AppBar, Box, Button, Container, Link as MuiLink, Toolbar, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/image";
import NextLink from 'next/link';
import topPageImage from '../../../public/maemob-toppage.webp';
// import topPageImage from '../../../public/maemob-toppage-2.png';

export const TopPageComponent = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MaeMob
            </Typography>
            <MuiLink
              component={NextLink}
              underline="none"
              color={'white'}
              href={`/api/auth/login?returnTo=/conventions`}
            >
              <Button color="inherit">Login</Button>
            </MuiLink>
          </Toolbar>
        </AppBar>
        <Grid2 container>
          <Grid2 xs={12}>
            <Box sx={{
              width: '100%',
              height: 'auto',
              overflow: 'hidden'
            }}>
              <Image
                src={topPageImage}
                alt="MaeMobイメージ画像"
                layout="responsive"
              />
            </Box>
          </Grid2>
          <>
            <Grid2 xs={12} display='flex' justifyContent='center'>
              <Typography component='h2' variant="h2">使い方</Typography>
            </Grid2>
          </>
          <>
            <Grid2 xs={0} md={3} display='flex' justifyContent='center'>
            </Grid2>
            <Grid2 xs={12} md={6} display='flex' justifyContent='left'>
              <Typography component='h2' variant="h4">①ユーザー登録</Typography>
            </Grid2>
            <Grid2 xs={0} md={3} display='flex' justifyContent='center'>
            </Grid2>
          </>
          <>
            <Grid2 xs={0} md={3} display='flex' justifyContent='center'>
            </Grid2>
            <Grid2 xs={12} md={6} display='flex' justifyContent='left'>
              <Typography component='h2' variant="h4">②大会を登録</Typography>
            </Grid2>
            <Grid2 xs={0} md={3} display='flex' justifyContent='center'>
            </Grid2>
          </>
        </Grid2>
        <Box height='150px'></Box>
        <AppBar component="footer" position="static" sx={{ backgroundColor: '#000000' }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption">
                ©2024 engr-sng
              </Typography>
            </Box>
          </Container>
        </AppBar>
      </Box>
    </>
  )
};
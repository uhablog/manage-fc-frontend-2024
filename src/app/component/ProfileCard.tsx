import { UserProfile } from "@auth0/nextjs-auth0/client";
import { Box, Button, Card, CardActions, CardContent, Tab, Tabs, Typography } from "@mui/material";
import Image from "next/image";

type Props = {
  user: UserProfile
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProfileCard = ({ user, value, handleChange }: Props) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'left', p: 2 }}>
          <Image
            src={user.picture ?? ''}
            alt={user.name ?? ''}
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
          <Typography variant="h5" component="div">{user?.name}</Typography>
          <CardActions>
            <Button size="small" href="/api/auth/logout" variant="contained" color="primary">
              Logout
            </Button>
          </CardActions>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="概要" {...a11yProps(0)} />
            <Tab label="スカッド" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </CardContent>
    </Card>
  )
};

export default ProfileCard;
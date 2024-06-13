import { Claims } from "@auth0/nextjs-auth0";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import Image from "next/image";

type Props = {
  user: Claims
}
const ProfileCard = ({ user }: Props) => {
  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'left', p: 2 }}>
        <Image
          src={user.picture}
          alt={user.name}
          width={100}
          height={100}
          style={{ borderRadius: '50%' }}
        />
        <CardContent>
          <Typography variant="h5" component="div">{user.name}</Typography>
        </CardContent>
        <Box sx={{ justifyContent: 'right'}}>
          <CardActions>
            <Button size="small" href="/api/auth/logout" variant="contained" color="primary">
              Logout
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  )
};

export default ProfileCard;
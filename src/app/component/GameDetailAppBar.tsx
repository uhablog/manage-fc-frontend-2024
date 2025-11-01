import { Delete } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Typography, Link as MuiLink, IconButton } from '@mui/material';
import NextLink from "next/link";
import { useRouter } from 'next/navigation';

type Props = {
  convention_id: string
  game_id: string
}

export default function ButtonAppBar({convention_id, game_id}: Props) {

  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/game', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_id
        })
      });

      const json = await response.json();

      if (json.success) {
        router.push(`/conventions/${convention_id}`);
      } else {
        window.alert('削除失敗');
      }

    } catch (error) {
      console.log(error);
      window.alert('削除失敗');
    };
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100%'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MaeMob
          </Typography>
          <MuiLink component={NextLink} underline='none' href={`/conventions/${convention_id}`}>
            <Button color="secondary">大会へ</Button>
          </MuiLink>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
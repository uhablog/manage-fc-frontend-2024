import { getAccessToken } from "@auth0/nextjs-auth0";
import { Card, CardContent, CardHeader, List, ListItem, ListItemText, Typography } from "@mui/material";

type Props = {
  user_id: string
}

type Scorer = {
  scorer_name: string
  total_goals: number
  id: string
  rank: string
}

const UserTopScorer = async ({ user_id }: Props) => {
  const accessTokenResult = await getAccessToken();

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/top-scorer?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">トップスコアラー</Typography>
          <List>
            {json.data.map( (scorer: Scorer, index: number) => (
              <ListItem
                key={index}
                disableGutters
                secondaryAction={
                  scorer.total_goals
                }
              >
                <ListItemText primary={`${scorer.scorer_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};

export default UserTopScorer;
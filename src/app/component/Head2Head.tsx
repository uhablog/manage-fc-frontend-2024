import { getAccessToken } from "@auth0/nextjs-auth0";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";

type Props = {
  auth0_user_id: string
}

type Head2HeadType = {
  opponent_team_name: string
  games_played: string
  wins: string
  draws: string
  losses: string
  match_scorers: []
}

const Head2Head = async ({ auth0_user_id }: Props) => {

  const accessTokenResult = await getAccessToken();
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/head2head?user_id=${auth0_user_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessTokenResult.accessToken}`
    }
  });

  const json = await result.json();

  return (
    <>
      {json.data.map(( head2head: Head2HeadType, index: number) => (
        <Box key={index}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              {head2head.opponent_team_name}
            </AccordionSummary>
            <AccordionDetails>
              試合数: {head2head.games_played}<br/>
              勝利数: {head2head.wins}<br/>
              引分数: {head2head.draws}<br/>
              敗北数: {head2head.losses}
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </>
  )
};

export default Head2Head;
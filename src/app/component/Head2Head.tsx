import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

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

const Head2Head = ({ auth0_user_id }: Props) => {

  const [head2head, setHead2Head] = useState<Head2HeadType[]>([]);

  useEffect(() => {
    const fetchHead2Head = async () => {
      const res = await fetch(`/api/user/head2head?user_id=${auth0_user_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      console.log(json);
      if (json.success) {
        setHead2Head(json.data);
      }
    };
    fetchHead2Head();
  }, [auth0_user_id]);

  return (
    <>
      {head2head.map(( head2head: Head2HeadType, index: number) => (
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
              <List>
                <ListItem
                  disableGutters
                  secondaryAction={head2head.games_played}
                >
                  <ListItemText primary={'試合数'}/>
                </ListItem>
                <ListItem
                  disableGutters
                  secondaryAction={head2head.wins}
                >
                  <ListItemText primary={'勝利数'}/>
                </ListItem>
                <ListItem
                  disableGutters
                  secondaryAction={head2head.draws}
                >
                  <ListItemText primary={'引分数'}/>
                </ListItem>
                <ListItem
                  disableGutters
                  secondaryAction={head2head.losses}
                >
                  <ListItemText primary={'敗北数'}/>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </>
  )
};

export default Head2Head;
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  team_id: string
}

type ConventionTeamData = {
  auth0_user_id: string
  footballapi_player_id: number
  games: number
  win: number
  draw: number
  lose: number
  totalScore: number
  concededPoints: number
  manager_name: string
  team_name: string
}

const DisplayTeamDetail = ({
  team_id
}: Props) => {

  const [team, setTeam] = useState<ConventionTeamData[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      const res = await fetch(`/api/team?team_id=${team_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      console.log(json);
      setTeam(json);
    };
    fetchTeam();
  }, [team_id]);
  return (
    // team ?? (
      <>
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            {
            }
          </Grid2>
        </Grid2>
      </>
    // )
  )
};

export default DisplayTeamDetail;
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import DisplaySquad from "./Squad";
import { Team } from "@/types/Team";
import TeamDetailHeader from "./TeamDetailHeader";
import CustomTabPanel from "./CustomTabPanel";
import TeamSummary from "./TeamSummary";

type Props = {
  convention_id: string
  team_id: string
}

const DisplayTeamDetail = ({
  convention_id,
  team_id
}: Props) => {

  const [teamData, setTeamData] = useState<Team[]>([]);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      const res = await fetch(`/api/team?team_id=${team_id}`, {
        method: 'GET'
      });
      const json = await res.json();
      setTeamData(json.squads);
    };
    fetchTeam();
  }, [team_id]);
  return (
      <>
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <TeamDetailHeader
              convention_id={convention_id}
              teamData={teamData[0]}
              value={value}
              handleChange={handleChange}
            />
            <CustomTabPanel value={value} index={0}>
              <TeamSummary
                team_id={team_id}
                team_data={teamData[0]}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <DisplaySquad user_id={teamData[0]?.auth0_user_id} />
            </CustomTabPanel>
          </Grid2>
        </Grid2>
      </>
    // )
  )
};

export default DisplayTeamDetail;
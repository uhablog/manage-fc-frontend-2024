import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { Team } from "@/types/Team";
import TeamDetailHeader from "./TeamDetailHeader";
import CustomTabPanel from "./CustomTabPanel";
import TeamSummary from "./TeamSummary";
import TeamSquad from "./TeamSquad";

type Props = {
  convention_id: string
  team_id: string
}

const DisplayTeamDetail = ({
  convention_id,
  team_id
}: Props) => {

  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/team?team_id=${team_id}`, {
          method: 'GET'
        });

        if (!res.ok) {
          throw new Error("チーム情報の取得に失敗しました。");
        }

        const json = await res.json();
        let team: Team | null = null;

        if (Array.isArray(json?.squads) && json.squads.length > 0) {
          team = json.squads[0];
        } else if (json?.squads && typeof json.squads === "object") {
          team = json.squads as Team;
        } else if (Array.isArray(json) && json.length > 0) {
          team = json[0] as Team;
        }

        if (!team) {
          throw new Error("チーム情報が見つかりません。");
        }

        setTeamData(team);
      } catch (err) {
        console.error(err);
        setError("チーム情報の取得に失敗しました。");
        setTeamData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [team_id]);

  if (loading) {
    return <>Loading...</>;
  }

  if (error || !teamData) {
    return <>{error ?? "チーム情報を読み込めませんでした。"}</>;
  }
  return (
      <>
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <TeamDetailHeader
              convention_id={convention_id}
              teamData={teamData}
              value={value}
              handleChange={handleChange}
            />
            <CustomTabPanel value={value} index={0}>
              <TeamSummary
                team_id={team_id}
                team_data={teamData}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TeamSquad team_id={team_id} auth0_user_id={teamData.auth0_user_id} />
            </CustomTabPanel>
          </Grid2>
        </Grid2>
      </>
  )
};

export default DisplayTeamDetail;
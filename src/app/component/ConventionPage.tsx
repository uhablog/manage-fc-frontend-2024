import { useState } from "react";
import DisplayGames from "./DisplayGames";
import ConventionHeader from "./ConventionHeader";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DisplayTeams from "./DisplayTeams";
import ConventionSummary from "./ConventionSummary";
import StatsGrid from "./StatsGrid";
import CustomTabPanel from "./CustomTabPanel";
import DisplayBestEleven from "./ConventionBestEleven";

type Props = {
  id: string
}

const ConventionPage = ({id}: Props) => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid2 container spacing={2} sx={{margin: {md: 3}}} width={'100%'}>
        <Grid2 xs={12}>
          <ConventionHeader id={id} value={value} handleChange={handleChange} />
          <CustomTabPanel value={value} index={0}>
            <ConventionSummary id={id}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DisplayTeams id={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DisplayGames convention_id={id} addButtonDisplay={true} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <StatsGrid convention_id={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <DisplayBestEleven convention_id={id} />
          </CustomTabPanel>
        </Grid2>
      </Grid2>
    </>
  )
};

export default ConventionPage;
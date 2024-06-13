import { useEffect, useState } from "react";
import DisplayGames from "./DisplayGames";
import ConventionHeader from "./ConventionHeader";
import { Game } from "@/types/Game";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/material";
import DisplayTeams from "./DisplayTeams";
import DisplayScorer from "./DisplayScorer";
import ConventionSummary from "./ConventionSummary";

type Props = {
  id: string
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ConventionPage = ({id}: Props) => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <ConventionHeader id={id} value={value} handleChange={handleChange} />
          <CustomTabPanel value={value} index={0}>
            <ConventionSummary id={id}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DisplayTeams id={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DisplayGames convention_id={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <DisplayScorer id={id} />
          </CustomTabPanel>
        </Grid2>
      </Grid2>
    </>
  )
};

export default ConventionPage;
import { Convention } from "@/types/Convention";
import { Box, Card, CardContent, Tab, Tabs, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

type Props = {
  id: string
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ConventionHeader = ({id, value, handleChange}: Props) => {

  const [convention, setConvention] = useState<Convention>();


  useEffect(() => {
    const fetchConvention = async () => {
      const res = await fetch(`/api/convention?convention_id=${id}`);
      const json = await res.json();
      setConvention(json.data[0]);
    }
    fetchConvention();
  }, [id]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h4">{convention?.convention_name}</Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="概要" {...a11yProps(0)} />
              <Tab label="順位表" {...a11yProps(1)} />
              <Tab label="試合" {...a11yProps(2)} />
              <Tab label="スタッツ" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </CardContent>
      </Card>
    </>
  )
};

export default ConventionHeader;
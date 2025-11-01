import { Card, CardContent, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export const TimelineEmpty = ({ message }: { message: string }) => (
  <Card variant="outlined" sx={{ borderStyle: "dashed", borderColor: grey[300] }}>
    <CardContent>
      <Typography variant="body2" color={grey[600]}>
        {message}
      </Typography>
    </CardContent>
  </Card>
);

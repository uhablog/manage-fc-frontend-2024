import { Avatar, Stack, Typography } from "@mui/material";

export const TeamSummaryDetailGame = ({
  label,
  emblem,
  align,
  color,
}: {
  label: string;
  emblem?: string | null;
  align: "left" | "right";
  color: string;
}) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent={align === "left" ? "flex-start" : "flex-end"}
  >
    {align === "right" && (
      <Typography variant="subtitle1" sx={{ color }} textAlign="right">
        {label}
      </Typography>
    )}
    <Avatar
      src={emblem ?? undefined}
      alt={label}
      sx={{ bgcolor: color, width: 40, height: 40 }}
    >
      {label.charAt(0)}
    </Avatar>
    {align === "left" && (
      <Typography variant="subtitle1" sx={{ color }}>
        {label}
      </Typography>
    )}
  </Stack>
);
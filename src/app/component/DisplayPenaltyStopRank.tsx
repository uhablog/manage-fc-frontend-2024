import { PenaltyStopRank } from "@/types/PenaltyStopRank";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { PlayerStatsDialog } from "./PlayerStatsDialog";

type Props = {
  id: string;
  initialLimit?: number;
};

const DisplayPenaltyStopRank = ({ id, initialLimit }: Props) => {
  const [penaltyStops, setPenaltyStops] = useState<PenaltyStopRank[]>([]);
  const [limit, setLimit] = useState<number | undefined>(initialLimit);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  useEffect(() => {
    const fetchPenaltyStops = async () => {
      try {
        const res = await fetch(`/api/convention/${id}/penalty-stop?stat=penalty-stop`);
        if (!res.ok) {
          throw new Error(`failed to fetch penalty stop rank: ${res.status}`);
        }
        const json = await res.json();
        const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        setPenaltyStops(data);
      } catch (error) {
        console.error("failed to fetch penalty stop rank", error);
        setPenaltyStops([]);
      }
    };

    fetchPenaltyStops();
  }, [id]);

  const showAll = () => {
    setLimit(undefined);
  };

  const hideLimit = () => {
    if (initialLimit) {
      setLimit(initialLimit);
    } else {
      setLimit(5);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClick = (playerId: string, teamId: string) => {
    setSelectedPlayer(playerId);
    setSelectedTeamId(teamId);
    setOpen(true);
  };

  const visibleStops = limit ? penaltyStops.slice(0, limit) : penaltyStops;

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="p">
            Penalty Stops
          </Typography>
          <List>
            <Grid2 container spacing={2}>
              {visibleStops.map((stop, index) => (
                <ListItem
                  key={`${stop.footballapi_player_id}-${index}`}
                  disableGutters
                  onClick={() => handleClick(stop.footballapi_player_id, stop.team_id)}
                  sx={{
                    borderRadius: 1,
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      boxShadow: 1,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Grid2 xs={1}>
                    <Typography variant="body2">{stop.rank}</Typography>
                  </Grid2>
                  <Grid2 xs={2}>
                    <ListItemAvatar>
                      <Avatar
                        alt={`penalty stop rank ${index + 1}`}
                        src={`https://media.api-sports.io/football/players/${stop.footballapi_player_id}.png`}
                      />
                    </ListItemAvatar>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography
                      component="p"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {stop.gk_name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={stop.emblem_url ?? undefined}
                        alt={`${stop.team_name} emblem`}
                        sx={{ width: 20, height: 20 }}
                      >
                        {stop.team_name?.charAt(0) ?? "?"}
                      </Avatar>
                      <MuiLink
                        component={NextLink}
                        underline="none"
                        color="black"
                        href={`/conventions/${id}/team/${stop.team_id}`}
                        sx={{
                          "&:hover": {
                            color: "blue",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        <Typography variant="body2">{stop.team_name}</Typography>
                      </MuiLink>
                    </Stack>
                  </Grid2>
                  <Grid2 xs={1}>
                    <Typography>{stop.saves}</Typography>
                  </Grid2>
                </ListItem>
              ))}
            </Grid2>
          </List>
          {limit === undefined ? (
            <Button onClick={hideLimit}>部分的に表示</Button>
          ) : (
            <Button onClick={showAll}>すべて表示</Button>
          )}
        </CardContent>
      </Card>
      <PlayerStatsDialog open={open} onClose={onClose} team_id={selectedTeamId} player_id={selectedPlayer} />
    </>
  );
};

export default DisplayPenaltyStopRank;


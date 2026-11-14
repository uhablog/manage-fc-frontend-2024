'use client'

import { Team } from "@/types/Team";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from 'next/link';
import { useState } from "react";

type Props = {
  convention_id: string
  team_id: string
  teamData: Team
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  onTeamUpdated: (team: Partial<Team>) => void
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TeamDetailHeader = ({
  convention_id,
  team_id,
  teamData,
  value,
  handleChange,
  onTeamUpdated,
}: Props) => {

  const emblemUrl = teamData.emblem_url ?? undefined;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [managerNameError, setManagerNameError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const openDialog = () => {
    setTeamName(teamData.team_name);
    setManagerName(teamData.manager_name);
    setTeamNameError("");
    setManagerNameError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialogOpen(false);
    setTeamNameError("");
    setManagerNameError("");
  };

  const validateName = (value: string, label: string) => {
    const normalized = value.trim();
    if (!normalized) return `${label}を入力してください。`;
    if (normalized.length > 500) return `${label}は500文字以内で入力してください。`;
    return "";
  };

  const handleSubmit = async () => {
    const normalizedTeamName = teamName.trim();
    const normalizedManagerName = managerName.trim();
    const nextTeamNameError = validateName(teamName, "チーム名");
    const nextManagerNameError = validateName(managerName, "監督名");
    setTeamNameError(nextTeamNameError);
    setManagerNameError(nextManagerNameError);
    if (nextTeamNameError || nextManagerNameError) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/team/${encodeURIComponent(team_id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_name: normalizedTeamName,
          manager_name: normalizedManagerName,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "チーム情報の更新に失敗しました。");
      }

      onTeamUpdated(result.data);
      setDialogOpen(false);
      setSnackbar({ open: true, message: "チーム情報を更新しました。", severity: "success" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "チーム情報の更新に失敗しました。",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={emblemUrl}
            alt={`${teamData.team_name} emblem`}
            sx={{ width: 64, height: 64}}
          >
            {teamData.team_name?.charAt(0) ?? "?"}
          </Avatar>
          <Box>
            <Typography variant="h5" component="p">
              {teamData?.team_name}
            </Typography>
            <Typography variant="h6" component="p">
              {teamData?.manager_name}
            </Typography>
          </Box>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" onClick={openDialog}>編集</Button>
            <Button
              color="primary"
              component={NextLink}
              href={`/conventions/${convention_id}`}
            >
              大会へ
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="概要" {...a11yProps(0)} />
            <Tab label="スカッド" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </CardContent>
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>チーム情報を編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="チーム名"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            error={Boolean(teamNameError)}
            helperText={teamNameError}
            inputProps={{ maxLength: 501 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="監督名"
            value={managerName}
            onChange={(event) => setManagerName(event.target.value)}
            error={Boolean(managerNameError)}
            helperText={managerNameError}
            inputProps={{ maxLength: 501 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={submitting}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? "更新中..." : "更新"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default TeamDetailHeader;

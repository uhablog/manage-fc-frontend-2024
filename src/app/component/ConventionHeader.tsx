import { Convention } from "@/types/Convention";
import {
  Alert,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conventionName, setConventionName] = useState("");
  const [heldDay, setHeldDay] = useState("");
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });


  useEffect(() => {
    const fetchConvention = async () => {
      const res = await fetch(`/api/convention?convention_id=${id}`);
      const json = await res.json();
      setConvention(json.data[0]);
    };
    fetchConvention();
  }, [id]);

  const openDialog = () => {
    if (!convention) return;
    setConventionName(convention.convention_name);
    setHeldDay(convention.held_day.slice(0, 10));
    setNameError("");
    setDateError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialogOpen(false);
    setNameError("");
    setDateError("");
  };

  const isRealDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  };

  const handleSubmit = async () => {
    const normalizedName = conventionName.trim();
    const nextNameError = !normalizedName
      ? "大会名を入力してください。"
      : normalizedName.length > 500
        ? "大会名は500文字以内で入力してください。"
        : "";
    const nextDateError = !isRealDate(heldDay)
      ? "開催日を正しく入力してください。"
      : "";

    setNameError(nextNameError);
    setDateError(nextDateError);
    if (nextNameError || nextDateError) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/convention/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convention_name: normalizedName, held_day: heldDay }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "大会情報の更新に失敗しました。");
      }

      setConvention((current) => current ? { ...current, ...result.data } : result.data);
      setDialogOpen(false);
      setSnackbar({ open: true, message: "大会情報を更新しました。", severity: "success" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "大会情報の更新に失敗しました。",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Box>
              <Typography variant="h4">{convention?.convention_name}</Typography>
              {convention?.held_day && (
                <Typography color="text.secondary">
                  開催日: {convention.held_day.slice(0, 10)}
                </Typography>
              )}
            </Box>
            <Button variant="outlined" onClick={openDialog} disabled={!convention}>
              編集
            </Button>
          </Stack>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable" // 横スクロールを有効化
              scrollButtons="auto" // スクロールボタンを自動表示
              allowScrollButtonsMobile // モバイルでもスクロールボタンを表示
            >
              <Tab label="概要" {...a11yProps(0)} />
              <Tab label="順位" {...a11yProps(1)} />
              <Tab label="試合" {...a11yProps(2)} />
              <Tab label="スタッツ" {...a11yProps(3)} />
              <Tab label="ベストイレブン" {...a11yProps(4)} />
            </Tabs>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>大会情報を編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="大会名"
            value={conventionName}
            onChange={(event) => setConventionName(event.target.value)}
            error={Boolean(nameError)}
            helperText={nameError}
            inputProps={{ maxLength: 501 }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="開催日"
            value={heldDay}
            onChange={(event) => setHeldDay(event.target.value)}
            error={Boolean(dateError)}
            helperText={dateError}
            InputLabelProps={{ shrink: true }}
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
    </>
  );
};

export default ConventionHeader;

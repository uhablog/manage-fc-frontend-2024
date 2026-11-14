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
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const [convention, setConvention] = useState<Convention>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conventionName, setConventionName] = useState("");
  const [heldDay, setHeldDay] = useState("");
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyConventionName, setCopyConventionName] = useState("");
  const [copyHeldDay, setCopyHeldDay] = useState("");
  const [copyNameError, setCopyNameError] = useState("");
  const [copyDateError, setCopyDateError] = useState("");
  const [copying, setCopying] = useState(false);
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

  const openCopyDialog = () => {
    if (!convention) return;
    setCopyConventionName(convention.convention_name);
    setCopyHeldDay("");
    setCopyNameError("");
    setCopyDateError("");
    setCopyDialogOpen(true);
  };

  const closeCopyDialog = () => {
    if (copying) return;
    setCopyDialogOpen(false);
    setCopyNameError("");
    setCopyDateError("");
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

  const handleCopy = async () => {
    const normalizedName = copyConventionName.trim();
    const nextNameError = !normalizedName
      ? "大会名を入力してください。"
      : normalizedName.length > 500
        ? "大会名は500文字以内で入力してください。"
        : "";
    const nextDateError = !isRealDate(copyHeldDay)
      ? "開催日を正しく入力してください。"
      : "";

    setCopyNameError(nextNameError);
    setCopyDateError(nextDateError);
    if (nextNameError || nextDateError) return;

    setCopying(true);
    try {
      const response = await fetch(`/api/convention/${encodeURIComponent(id)}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convention_name: normalizedName,
          held_day: copyHeldDay,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "大会のコピーに失敗しました。");
      }

      setCopyDialogOpen(false);
      router.push(`/conventions/${result.data.id}`);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "大会のコピーに失敗しました。",
        severity: "error",
      });
    } finally {
      setCopying(false);
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
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button variant="outlined" onClick={openDialog} disabled={!convention}>
                編集
              </Button>
              <Button variant="outlined" onClick={openCopyDialog} disabled={!convention}>
                コピー
              </Button>
            </Stack>
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
      <Dialog open={copyDialogOpen} onClose={closeCopyDialog} fullWidth maxWidth="sm">
        <DialogTitle>大会をコピー</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
            参加チームの名前・マネージャー・担当ユーザーを引き継ぎ、現在の保有選手から新しいスカッドを作成します。試合や成績はコピーしません。
          </Alert>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="大会名"
            value={copyConventionName}
            onChange={(event) => setCopyConventionName(event.target.value)}
            error={Boolean(copyNameError)}
            helperText={copyNameError}
            inputProps={{ maxLength: 501 }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="開催日"
            value={copyHeldDay}
            onChange={(event) => setCopyHeldDay(event.target.value)}
            error={Boolean(copyDateError)}
            helperText={copyDateError}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCopyDialog} disabled={copying}>キャンセル</Button>
          <Button onClick={handleCopy} variant="contained" disabled={copying}>
            {copying ? "コピー中..." : "コピーを作成"}
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

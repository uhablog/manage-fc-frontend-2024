import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

type Props = {
  eventLabel: string;
  onEdit: () => void;
  onDelete: () => Promise<void>;
};

export const EventActionButtons = ({ eventLabel, onEdit, onDelete }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete();
      setConfirmOpen(false);
    } catch {
      // 呼び出し元がSnackbarへエラーを表示するため、確認ダイアログは開いたままにする。
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="編集">
          <IconButton size="small" onClick={onEdit} aria-label={`${eventLabel}を編集`}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="削除">
          <IconButton
            size="small"
            color="error"
            onClick={() => setConfirmOpen(true)}
            aria-label={`${eventLabel}を削除`}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>イベントを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {eventLabel}を削除します。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            キャンセル
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

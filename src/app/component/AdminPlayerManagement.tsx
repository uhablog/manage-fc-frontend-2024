'use client';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  AdminMember,
  AdminPlayer,
  ApiFootballPlayer,
  ApiFootballPlayerTeam,
  ApiFootballSquadPlayer,
  ApiFootballTeam,
  OwnershipHistory
} from '@/types/AdminPlayer';

type ConfirmState = {
  title: string;
  message: string;
  action: () => Promise<void>;
};

const requestJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.message || '処理に失敗しました');
  }
  return json.data as T;
};

const AdminPlayerManagement = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState(0);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [bulkOwner, setBulkOwner] = useState('');
  const [history, setHistory] = useState<OwnershipHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayerName, setHistoryPlayerName] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; error: boolean }>({
    open: false,
    message: '',
    error: false
  });

  const [playerSearch, setPlayerSearch] = useState('');
  const [externalPlayers, setExternalPlayers] = useState<ApiFootballPlayer[]>([]);
  const [selectedExternalPlayer, setSelectedExternalPlayer] = useState<ApiFootballPlayer | null>(null);
  const [externalPlayerTeams, setExternalPlayerTeams] = useState<ApiFootballPlayerTeam[]>([]);
  const [teamSearch, setTeamSearch] = useState('');
  const [externalTeams, setExternalTeams] = useState<ApiFootballTeam[]>([]);
  const [selectedExternalTeam, setSelectedExternalTeam] = useState<ApiFootballTeam | null>(null);
  const [season, setSeason] = useState(String(new Date().getFullYear()));
  const [externalSquad, setExternalSquad] = useState<ApiFootballSquadPlayer[]>([]);
  const [selectedExternalIds, setSelectedExternalIds] = useState<number[]>([]);
  const [importOwner, setImportOwner] = useState('');

  const notify = (message: string, error = false) => setSnackbar({ open: true, message, error });

  const fetchMembers = useCallback(async () => {
    const data = await requestJson<AdminMember[]>('/api/admin/members', { cache: 'no-store' });
    setMembers(data);
  }, []);

  const fetchPlayers = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (search.trim()) params.set('search', search.trim());
    if (ownerFilter !== 'all') params.set('owner', ownerFilter);
    const data = await requestJson<{
      players: AdminPlayer[];
      pagination: { total: number };
    }>(`/api/admin/players?${params}`, { cache: 'no-store' });
    setPlayers(data.players);
    setTotal(data.pagination.total);
    setSelectedPlayers([]);
  }, [ownerFilter, page, search]);

  useEffect(() => {
    const loadAccess = async () => {
      try {
        const data = await requestJson<{ is_admin: boolean }>('/api/admin/me', { cache: 'no-store' });
        setIsAdmin(data.is_admin);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    loadAccess();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([fetchMembers(), fetchPlayers()]).catch((error: Error) => notify(error.message, true));
  }, [fetchMembers, fetchPlayers, isAdmin]);

  const updateOwner = async (playerId: string, ownerMemberId: string | null) => {
    setBusy(true);
    try {
      await requestJson(`/api/admin/players/${playerId}/owner`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_member_id: ownerMemberId })
      });
      await fetchPlayers();
      notify('保有者を更新しました');
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const bulkUpdateOwner = async () => {
    setBusy(true);
    try {
      await requestJson('/api/admin/players/bulk-owner', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_ids: selectedPlayers,
          owner_member_id: bulkOwner || null
        })
      });
      await fetchPlayers();
      notify(`${selectedPlayers.length}名の保有者を更新しました`);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const openHistory = async (player: AdminPlayer) => {
    setBusy(true);
    try {
      const data = await requestJson<OwnershipHistory[]>(`/api/admin/players/${player.id}/history`, { cache: 'no-store' });
      setHistory(data);
      setHistoryPlayerName(player.player_name);
      setHistoryOpen(true);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const updateRole = async (member: AdminMember, role: 'admin' | 'member') => {
    setBusy(true);
    try {
      await requestJson(`/api/admin/members/${member.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      await fetchMembers();
      notify('メンバー権限を更新しました');
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const searchExternalPlayers = async () => {
    if (playerSearch.trim().length < 4) {
      notify('選手名は4文字以上で入力してください', true);
      return;
    }
    setBusy(true);
    try {
      const data = await requestJson<ApiFootballPlayer[]>(`/api/admin/api-football/players?search=${encodeURIComponent(playerSearch.trim())}`);
      setExternalPlayers(data);
      setSelectedExternalPlayer(null);
      setExternalPlayerTeams([]);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const loadPlayerTeams = async (player: ApiFootballPlayer) => {
    setBusy(true);
    try {
      const data = await requestJson<ApiFootballPlayerTeam[]>(`/api/admin/api-football/players/${player.id}/teams`);
      setSelectedExternalPlayer(player);
      setExternalPlayerTeams(data);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const searchExternalTeams = async () => {
    if (teamSearch.trim().length < 3) {
      notify('クラブ名は3文字以上で入力してください', true);
      return;
    }
    setBusy(true);
    try {
      setExternalTeams(await requestJson<ApiFootballTeam[]>(`/api/admin/api-football/teams?search=${encodeURIComponent(teamSearch.trim())}`));
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const loadTeamSquad = async (team: ApiFootballTeam) => {
    if (!/^\d{4}$/.test(season)) {
      notify('シーズンは4桁の西暦で入力してください', true);
      return;
    }
    setBusy(true);
    try {
      const data = await requestJson<ApiFootballSquadPlayer[]>(`/api/admin/api-football/teams/${team.id}/squad?season=${season}`);
      setSelectedExternalTeam(team);
      setExternalSquad(data);
      setSelectedExternalIds([]);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const importPlayers = async (items: { footballapi_player_id: number; footballapi_team_id: number }[]) => {
    setBusy(true);
    try {
      await requestJson('/api/admin/players/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: Number(season),
          players: items,
          owner_member_id: importOwner || null
        })
      });
      await fetchPlayers();
      setExternalSquad((current) => current.map((player) => (
        items.some((item) => item.footballapi_player_id === player.footballapi_player_id)
          ? { ...player, registered: true }
          : player
      )));
      setExternalPlayers((current) => current.map((player) => (
        items.some((item) => item.footballapi_player_id === player.id)
          ? { ...player, registered: true }
          : player
      )));
      setSelectedExternalIds([]);
      notify(`${items.length}名の選手を取り込みました`);
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const showConfirm = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmState({ title, message, action });
  };

  if (isAdmin === null) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box>;
  }
  if (!isAdmin) {
    return <Alert severity="error" sx={{ m: 3 }}>この画面を表示するには組織管理者の権限が必要です。</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 1 }}>組織管理</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        現在の保有選手、API-Footballからの選手追加、メンバー権限を管理します。
      </Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" sx={{ mb: 3 }}>
        <Tab label="保有選手" />
        <Tab label="選手追加" />
        <Tab label="メンバー権限" />
      </Tabs>

      {tab === 0 && (
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="選手名" value={search} onChange={(event) => setSearch(event.target.value)} />
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>保有者</InputLabel>
              <Select value={ownerFilter} label="保有者" onChange={(event) => { setOwnerFilter(event.target.value); setPage(1); }}>
                <MenuItem value="all">すべて</MenuItem>
                <MenuItem value="unowned">未保有</MenuItem>
                {members.map((member) => <MenuItem key={member.id} value={member.id}>{member.nickname}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => { setPage(1); fetchPlayers(); }}>検索</Button>
          </Stack>

          <Paper sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <Typography>{selectedPlayers.length}名を選択中</Typography>
              <FormControl sx={{ minWidth: 220 }}>
                <InputLabel>一括変更先</InputLabel>
                <Select value={bulkOwner} label="一括変更先" onChange={(event) => setBulkOwner(event.target.value)}>
                  <MenuItem value="">未保有</MenuItem>
                  {members.map((member) => <MenuItem key={member.id} value={member.id}>{member.nickname}</MenuItem>)}
                </Select>
              </FormControl>
              <Button
                disabled={selectedPlayers.length === 0 || busy}
                onClick={() => showConfirm(
                  '保有者の一括変更',
                  `${selectedPlayers.length}名の保有者を変更します。既存大会のスカッドは変更されません。`,
                  bulkUpdateOwner
                )}
              >一括変更</Button>
            </Stack>
          </Paper>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead><TableRow>
                <TableCell padding="checkbox" />
                <TableCell>選手</TableCell><TableCell>Pos</TableCell><TableCell>国籍</TableCell>
                <TableCell>保有者</TableCell><TableCell>履歴</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell padding="checkbox"><Checkbox checked={selectedPlayers.includes(player.id)} onChange={() => setSelectedPlayers((current) => current.includes(player.id) ? current.filter((id) => id !== player.id) : [...current, player.id])} /></TableCell>
                    <TableCell><Stack direction="row" spacing={1} alignItems="center"><Avatar src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} /><Box><Typography>{player.player_name}</Typography><Typography variant="caption">ID: {player.footballapi_player_id}</Typography></Box></Stack></TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.nationality || '-'}</TableCell>
                    <TableCell>
                      <Select size="small" value={player.owner_member_id || ''} disabled={busy} onChange={(event) => updateOwner(player.id, event.target.value || null)} sx={{ minWidth: 160 }}>
                        <MenuItem value="">未保有</MenuItem>
                        {members.map((member) => <MenuItem key={member.id} value={member.id}>{member.nickname}</MenuItem>)}
                      </Select>
                    </TableCell>
                    <TableCell><Button onClick={() => openHistory(player)}>表示</Button></TableCell>
                  </TableRow>
                ))}
                {players.length === 0 && <TableRow><TableCell colSpan={6} align="center">対象の選手はいません</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>前へ</Button>
            <Typography>{page}ページ / 全{total}件</Typography>
            <Button disabled={page * 25 >= total} onClick={() => setPage((current) => current + 1)}>次へ</Button>
          </Stack>
        </Stack>
      )}

      {tab === 1 && (
        <Stack spacing={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>取り込み時の保有者</Typography>
            <FormControl fullWidth>
              <InputLabel>保有者（任意）</InputLabel>
              <Select value={importOwner} label="保有者（任意）" onChange={(event) => setImportOwner(event.target.value)}>
                <MenuItem value="">未保有として追加</MenuItem>
                {members.map((member) => <MenuItem key={member.id} value={member.id}>{member.nickname}</MenuItem>)}
              </Select>
            </FormControl>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">選手名から追加</Typography>
            <Typography variant="body2" color="text.secondary">API-Football上の姓を4文字以上で検索します。</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
              <TextField fullWidth label="選手名" value={playerSearch} onChange={(event) => setPlayerSearch(event.target.value)} />
              <Button variant="contained" disabled={busy} onClick={searchExternalPlayers}>検索</Button>
            </Stack>
            <List>
              {externalPlayers.map((player) => (
                <ListItem key={player.id} secondaryAction={<Button disabled={player.registered || busy} onClick={() => loadPlayerTeams(player)}>{player.registered ? '登録済み' : '所属クラブ'}</Button>}>
                  <ListItemAvatar><Avatar src={player.photo} /></ListItemAvatar>
                  <ListItemText primary={player.name} secondary={player.nationality || '-'} />
                </ListItem>
              ))}
            </List>
            {selectedExternalPlayer && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight="bold">{selectedExternalPlayer.name}の取り込み元クラブ</Typography>
                {externalPlayerTeams.map(({ team, position }) => (
                  <Stack key={team.id} direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
                    <Avatar src={team.logo} /><Typography sx={{ flexGrow: 1 }}>{team.name} / {position || '-'}</Typography>
                    <Button disabled={!position || busy} onClick={() => showConfirm('選手の取り込み', `${selectedExternalPlayer.name}を取り込みます。`, () => importPlayers([{ footballapi_player_id: selectedExternalPlayer.id, footballapi_team_id: team.id }]))}>取り込む</Button>
                  </Stack>
                ))}
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">クラブから一括追加</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ my: 2 }}>
              <TextField fullWidth label="クラブ名" value={teamSearch} onChange={(event) => setTeamSearch(event.target.value)} />
              <TextField label="シーズン" value={season} onChange={(event) => setSeason(event.target.value)} inputProps={{ maxLength: 4 }} />
              <Button variant="contained" disabled={busy} onClick={searchExternalTeams}>クラブ検索</Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {externalTeams.map((team) => <Button key={team.id} variant={selectedExternalTeam?.id === team.id ? 'contained' : 'outlined'} onClick={() => loadTeamSquad(team)}>{team.name}</Button>)}
            </Stack>
            {selectedExternalTeam && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">{selectedExternalTeam.name} / {season}</Typography>
                <List>
                  {externalSquad.map((player) => (
                    <ListItem key={player.footballapi_player_id}>
                      <Checkbox disabled={player.registered} checked={selectedExternalIds.includes(player.footballapi_player_id)} onChange={() => setSelectedExternalIds((current) => current.includes(player.footballapi_player_id) ? current.filter((id) => id !== player.footballapi_player_id) : [...current, player.footballapi_player_id])} />
                      <ListItemAvatar><Avatar src={`https://media.api-sports.io/football/players/${player.footballapi_player_id}.png`} /></ListItemAvatar>
                      <ListItemText primary={`${player.player_name} (${player.position})`} secondary={player.registered ? '登録済み' : player.nationality || '-'} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  disabled={selectedExternalIds.length === 0 || busy}
                  onClick={() => showConfirm('選手の一括取り込み', `${selectedExternalIds.length}名を取り込みます。`, () => importPlayers(externalSquad.filter((player) => selectedExternalIds.includes(player.footballapi_player_id)).map((player) => ({ footballapi_player_id: player.footballapi_player_id, footballapi_team_id: player.footballapi_team_id }))))}
                >選択した{selectedExternalIds.length}名を取り込む</Button>
              </Box>
            )}
          </Paper>
        </Stack>
      )}

      {tab === 2 && (
        <TableContainer component={Paper}>
          <Table><TableHead><TableRow><TableCell>メンバー</TableCell><TableCell>現在の権限</TableCell><TableCell>操作</TableCell></TableRow></TableHead>
            <TableBody>{members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.nickname}</TableCell><TableCell>{member.role === 'admin' ? '管理者' : '一般メンバー'}</TableCell>
                <TableCell>{member.role === 'admin'
                  ? <Button color="warning" disabled={busy} onClick={() => showConfirm('管理者の降格', `${member.nickname}を一般メンバーへ変更します。`, () => updateRole(member, 'member'))}>一般へ変更</Button>
                  : <Button disabled={busy} onClick={() => updateRole(member, 'admin')}>管理者へ変更</Button>}
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} fullWidth>
        <DialogTitle>{historyPlayerName}の保有者変更履歴</DialogTitle>
        <DialogContent dividers>
          {history.map((entry) => <Box key={entry.id} sx={{ mb: 2 }}><Typography>{entry.previous_owner_nickname || '未保有'} → {entry.new_owner_nickname || '未保有'}</Typography><Typography variant="caption">{new Date(entry.changed_date).toLocaleString('ja-JP')} / {entry.changed_by_nickname}</Typography></Box>)}
          {history.length === 0 && <Typography>変更履歴はありません</Typography>}
        </DialogContent>
        <DialogActions><Button onClick={() => setHistoryOpen(false)}>閉じる</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmState)} onClose={busy ? undefined : () => setConfirmState(null)}>
        <DialogTitle>{confirmState?.title}</DialogTitle><DialogContent><Typography>{confirmState?.message}</Typography></DialogContent>
        <DialogActions><Button disabled={busy} onClick={() => setConfirmState(null)}>キャンセル</Button><Button disabled={busy} variant="contained" onClick={async () => { const action = confirmState?.action; setConfirmState(null); if (action) await action(); }}>実行</Button></DialogActions>
      </Dialog>

      {busy && <CircularProgress size={28} sx={{ position: 'fixed', right: 24, bottom: 88, zIndex: 1400 }} />}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.error ? 'error' : 'success'} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPlayerManagement;

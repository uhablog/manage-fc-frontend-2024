import React, { useState } from 'react';
import { TextField, Button, useMediaQuery, useTheme, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StickyTextFieldProps {
  isMobile: boolean;
  onButtonClick: (comment: string) => void; // ボタン押下時のイベントハンドラーをPropsとして受け取る
}

type Props = {
  onButtonClick: (comment: string) => void; // ボタン押下時のイベントハンドラーをPropsとして受け取る
}

const StickyTextField = styled('div')<StickyTextFieldProps>(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  paddingLeft: `${theme.spacing(35)} !important`, // この値はサイドバーの幅によって調整
  padding: theme.spacing(2),
  paddingBottom: isMobile ? theme.spacing(23) : theme.spacing(2),
  background: theme.palette.background.paper,
  boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
}));

export default function BottomTextField({ onButtonClick }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [comment, setComment] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  // ボタンが押された時に親コンポーネントにコメントを送る
  const handleSend = () => {
    onButtonClick(comment);
    setComment("");
  };

  return (
    <StickyTextField isMobile={isMobile} onButtonClick={onButtonClick}>
      <TextField
        fullWidth
        label="Message"
        variant="outlined"
        value={comment}
        onChange={handleChange}
      />
      <Box ml={2}> {/* テキストフィールドとボタンの間にスペースを追加 */}
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </StickyTextField>
  );
}

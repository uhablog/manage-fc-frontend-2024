import { Game } from "@/types/Game";
import { useEffect, useState } from "react";
import GameScore from "./GameScore";
import DisplayComments from "./DisplayComments";
import BottomTextField from "./BottomTextField";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Comment } from "@/types/Comment";
import { Typography } from "@mui/material";
import ButtonAppBar from "./GameDetailAppBar";
import GameMomCard from "./GameMomCard";

type Props = {
  id: string
  game_id: string
}

const GameDetail = ({ id, game_id }: Props) => {

  const [ game, setGame ] = useState<Game>();
  const [ comments, setComments ] = useState<Comment[]>([]);
  const [ error, setError ] = useState<boolean>();

  useEffect( () => {
    const fetchGame = async () => {
      const res = await fetch(`/api/game?game_id=${game_id}`);
      const json = await res.json();

      if (json.success) {
        setGame(json.game);
        setComments(json.comments);
      } else {
        setError(true);
      }
    };

    fetchGame();
  }, [game_id]);

  const postComment = async (comment: string) => {
    if (!comment || comment === "") return;

    try {
      const response = await fetch(`/api/game/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_id,
          comment
        })
      });
      const json = await response.json();
      if (json.success) {
        const newComment = {
          comment: json.comment.comment,
          id: json.comment.id,
          user_id: json.comment.user_id
        };
        setComments([newComment, ...comments]);  // 新しいコメントを配列の先頭に追加
      }
    } catch (error) {
      console.log(error);
      console.log('コメント失敗');
    }
  };

  return (
    <>
      {
        error || game === undefined ?
        <>
          <Typography>試合情報の取得に失敗しました。</Typography>
        </>
        :
        <>
          <ButtonAppBar convention_id={id} game_id={game_id} />
          <Grid2 container spacing={2}>
            <Grid2 xs={12}>
              <GameScore
                convention_id={id}
                game={game}
              />
            </Grid2>
            <Grid2 xs={12}>
              <GameMomCard game={game}/>
            </Grid2>
            <Grid2 xs={12}>
              <DisplayComments comments={comments} />
            </Grid2>
          </Grid2>
          <BottomTextField onButtonClick={postComment} />
        </>
      }
    </>
  )
};

export default GameDetail;
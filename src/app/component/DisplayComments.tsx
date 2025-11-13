import { Comment } from "@/types/Comment";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BottomTextField from "./BottomTextField";

type Props = {
  game_id: string
  comments: Comment[]
  setComments: Dispatch<SetStateAction<Comment[]>>
}

const DisplayComments = ({
  game_id,
  comments,
  setComments
}: Props) => {

  const [noComment, setNoComment] = useState<boolean>(false);

  useEffect(() => {
    if (comments.length === 0) {
      setNoComment(true);
    } else {
      setNoComment(false);
    }
  }, [comments]);

  const postComment = async (comment: string) => {
    if (!comment || comment === "") return;

    try {
      const response = await fetch(`/api/game/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id,
          comment,
        }),
      });
      const json = await response.json();
      if (json.success) {
        const newComment = {
          comment: json.comment.comment,
          id: json.comment.id,
          user_id: json.comment.user_id,
        };
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          { noComment? 
            <Typography>コメントはありません</Typography>
          :
            <List>
              {comments.map( (comment: Comment, index: number) => (
                <ListItem
                  key={index}
                >
                  <ListItemText primary={`${comment.comment}`} />
                </ListItem>
              ))}
            </List>
          }
        </CardContent>
      </Card>
      <BottomTextField onButtonClick={postComment} />
    </>
  )
};

export default DisplayComments;
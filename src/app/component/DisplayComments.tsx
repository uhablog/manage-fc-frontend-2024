import { Comment } from "@/types/Comment";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  comments: Comment[]
}

const DisplayComments = ({comments}: Props) => {

  const [noComment, setNoComment] = useState<boolean>(false);

  useEffect(() => {
    if (comments.length === 0) {
      setNoComment(true);
    }
  }, [comments]);

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
    </>
  )
};

export default DisplayComments;
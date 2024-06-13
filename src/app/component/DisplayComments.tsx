import { Comment } from "@/types/Comment";
import { Card, CardContent, List, ListItem, ListItemText } from "@mui/material";

type Props = {
  comments: Comment[]
}

const DisplayComments = ({comments}: Props) => {

  return (
    <>
      <Card>
        <CardContent>
          <List>
            {comments.map( (comment: Comment, index: number) => (
              <ListItem
                key={index}
              >
                <ListItemText primary={`${comment.comment}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
};

export default DisplayComments;
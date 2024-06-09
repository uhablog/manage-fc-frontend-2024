import { Convention } from "@/types/Convention";
import { Card, CardContent, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NextLink from "next/link";

type Props = {
  conventions: Convention[]
}
const DisplayConventions = ({ conventions }: Props) => {

  return (
    <>
      <Grid2 container spacing={2} >
        {conventions?.map( (convention, index) => (
          <>
            <Grid2 xs={12} sm={6} md={3} key={index}>
              <MuiLink component={NextLink} underline="none" href={`/conventions/${convention.id}`}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component='div'>{convention.convention_name}</Typography>
                    <Typography variant="body2" color='text.secondary' >{convention.held_day.slice(0, 10)}</Typography>
                  </CardContent>
                </Card>
              </MuiLink>
            </Grid2>
          </>
        ))}
      </Grid2>
    </>
  )

}

export default DisplayConventions;
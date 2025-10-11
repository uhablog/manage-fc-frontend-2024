import { Convention } from "@/types/Convention";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Fab, Link as MuiLink, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NextLink from "next/link";

type Props = {
  conventions: Convention[]
}
const DisplayConventions = ({ conventions }: Props) => {

  return (
    <>
      <Grid2 container spacing={2} sx={{margin: {md: 3, xs: 1}}}>
        {conventions?.map( (convention, index) => (
          <>
            <Grid2 xs={12} sm={6} md={3} key={index}>
              <MuiLink component={NextLink} underline="none" href={`/conventions/${convention.id}`}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                      borderColor: "primary.main"
                    }
                  }}
                >
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
      <MuiLink component={NextLink} underline="none" href={`/conventions/add`} >
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
        >
          <Add />
        </Fab>
      </MuiLink>
    </>
  )

}

export default DisplayConventions;
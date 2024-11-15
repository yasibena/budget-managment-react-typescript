import { Box, Button, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const Error = () => {
  return (
    <Grid container height='100vh'>
      <Box color='white' m='auto' justifyContent='center' alignContent='center'>
        <Typography textAlign='center' variant='h5'>
          Page Not Found
        </Typography>
        <Button>
          <Link to='/dashboard' style={{ textDecoration: '#b76dde', color: 'purple' ,fontWeight:'600'}}>
          Retuen to Dashboard
          </Link>
        </Button>
      </Box>
    </Grid>
  )
}

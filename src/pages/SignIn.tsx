import { FormEvent, useContext, useState } from 'react'
import {
  Container, Box, TextField, createTheme, ThemeProvider,
  Typography, Checkbox, Button, Grid2, CircularProgress, Alert,
  Snackbar
} from '@mui/material'
import { MainContext } from '../context/mainContext'
import { Link, useNavigate } from 'react-router-dom'

const them = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#131129'
    },
    secondary: {
      main: '#2E073F'
    },
    text: {
      primary: '#aea9e4'
    }
  }
})


export const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [loadingSignUp, setLoadingSignup] = useState<boolean>()
  const [showALert, setShowAlert] = useState<boolean>(false)
  const [error, setError] = useState(false)
  const { signIn } = useContext(MainContext)

  const navigate = useNavigate()

  const handleSumbit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!termsAgreed || email.trim().length === 0 || password.trim().length === 0) {
      setError(true)
      return;
    }
    try {
      await signIn(email, password)
      setEmail('')
      setPassword('')
      setLoadingSignup(true)
      setTimeout(() => {
        setLoadingSignup(false)
      }, 2000);
      setShowAlert(true)
      navigate('/dashboard')
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  return (
    <ThemeProvider theme={them}>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={error}
          autoHideDuration={1200}
        >
          <Alert
            onClose={() => setError(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Please set all field!
          </Alert>
        </Snackbar>
      </Box>
      <Container maxWidth='sm' sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', overflow: 'hidden' }}>
        <Box component="form" bgcolor='#1d1933' mb='0' border='2px solid #2f2b43' borderRadius='5px' p={3} onClick={(event) => handleSumbit(event)}>
          <Grid2 container spacing={2} flexDirection='column' alignItems='center' justifyContent='space-around'>
            <Typography variant='h5' align='center' color='#AD49E1' fontWeight='600'>
              LOGIN
            </Typography>
            <Typography variant='subtitle1' align='center' color='#aea9e4'>
              manage your budget easily!
            </Typography>
            <Grid2 item xs={12} sm={6} width='100%'>
              <TextField
                value={email}
                type='email'
                onChange={(e) => setEmail((e.target.value))}
                margin="normal"
                fullWidth
                placeholder='Email'
                sx={{
                  background: '#131129',
                  color: "text",
                  border: '2px solid #2f2b43',
                  '& .MuiInputBase-input': {
                    color: '#text',
                    fontSize: '0.9rem',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#text',
                    fontSize: '0.9rem',
                    border: 'none'
                  },

                  borderRadius: '5px',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:focus-within': {
                    borderColor: '#AD49E1',
                    boxShadow: '0 0 0 1px rgba(173, 73, 225, 0.5)',
                  },
                }
                }
              />
              {
                (email.trim().length == 0 && showALert) &&
                <Alert severity="error" sx={{ bgcolor: 'transparent', p: '0' }}>Please type email.</Alert>
              }
            </Grid2>
            <Grid2 item xs={12} sm={6} width='100%'>
              <TextField
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                fullWidth
                placeholder='Password'
                sx={{
                  background: '#131129',
                  color: "text",
                  border: '2px solid #2f2b43',
                  '& .MuiInputBase-input': {
                    color: '#text',
                    fontSize: '0.9rem',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#text',
                    fontSize: '0.9rem',
                    border: 'none'
                  },
                  borderRadius: '5px',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:focus-within': {
                    borderColor: '#AD49E1',
                    boxShadow: '0 0 0 1px rgba(173, 73, 225, 0.5)',
                  },
                }
                }
              />
              {
                (password.trim().length == 0 && showALert) &&
                <Alert severity="error" sx={{ bgcolor: 'transparent', p: '0' }}>Please type password.</Alert>
              }
            </Grid2>
            <Grid2 display='flex' spacing={1}>
              <Checkbox
                size="small"
                checked={termsAgreed}
                sx={{
                  color: '#aea9e4',
                  marginTop: '-1.6rem',

                  '&.Mui-checked': {
                    color: '#aea9e4',
                  },
                }}
                onClick={() => setTermsAgreed(!termsAgreed)}
              />
              <Typography variant='body1' color='#aea9e4'>
                I certify that I am 18 years of age or older, and agree
                {" "}
                <br />
                to the User Agreementand Privacy Policy.
              </Typography>
            </Grid2>
            <Grid2 item xs={12} width='100%'>
              <Button sx={{
                bgcolor: '#AD49E1'
                , fontWeight: 'bold'
                , width: '100%'
                , '&:hover': {
                  bgcolor: '#9C3BCF',
                  animation: '0.5s ease-in-out'
                }
              }} >
                {loadingSignUp ? <CircularProgress /> : 'Login'}
              </Button>
            </Grid2>
            <Typography color='#aea9e4'>Dont have an account?
              <Link to='/signup' style={{ textDecoration: 'none' }}>
                <span style={{ color: '#AD49E1', fontSize: 'bold', cursor: 'pointer' }}> Sign up</span>
              </Link>
            </Typography>
          </Grid2>
        </Box>
      </Container>
    </ThemeProvider>
  )
}


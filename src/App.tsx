import { AuthProvider } from './context/mainContext.tsx'
import { SearchProvider } from './context/searchContext.tsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes.tsx'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material'

function App() {
  const theme = createTheme()
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

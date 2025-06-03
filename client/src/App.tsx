import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import SleepTracker from './pages/SleepTracker'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SleepTracker />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sleep-tracker" element={<SleepTracker />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App

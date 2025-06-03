import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import UsersPage from './routes/UsersPage'
import SleepTracker from './pages/SleepTracker'
import SleepAnalytics from './pages/SleepAnalytics'

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<SleepTracker />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="sleep-tracker" element={<SleepTracker />} />
            <Route path="sleep-analytics" element={<SleepAnalytics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

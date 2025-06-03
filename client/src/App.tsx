import { Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import UserDetailPage from './routes/UserDetailPage'
import CreateUserPage from './routes/CreateUserPage'
import EditUserPage from './routes/EditUserPage'
import NotFoundPage from './routes/NotFoundPage'
import SleepTracker from './pages/SleepTracker'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    }
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="users">
            <Route index element={<UsersPage />} />
            <Route path="new" element={<CreateUserPage />} />
            <Route path=":id" element={<UserDetailPage />} />
            <Route path=":id/edit" element={<EditUserPage />} />
          </Route>
          <Route path="sleep-tracker" element={<SleepTracker />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

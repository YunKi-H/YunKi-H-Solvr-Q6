import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format, subDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

interface SleepRecord {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  notes: string | null
}

interface ChartData {
  date: string
  sleepDuration: number
  sleepTime: string
  wakeTime: string
}

export default function SleepAnalytics() {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/sleep-records')
        const data = response.data
        setRecords(data)
        
        // 최근 7일 데이터만 사용
        const recentRecords = data.slice(-7)
        const formattedData = recentRecords.map((record: SleepRecord) => {
          const sleepDate = new Date(`${record.date}T${record.sleepTime}`)
          const wakeDate = new Date(`${record.date}T${record.wakeTime}`)
          const duration = (wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60) // 시간 단위로 변환
          
          return {
            date: format(new Date(record.date), 'MM/dd', { locale: ko }),
            sleepDuration: Number(duration.toFixed(1)),
            sleepTime: record.sleepTime,
            wakeTime: record.wakeTime
          }
        })
        
        setChartData(formattedData)
      } catch (error) {
        console.error('수면 기록을 불러오는데 실패했습니다:', error)
      }
    }

    if (user) {
      fetchRecords()
    }
  }, [user])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        수면 분석
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          수면 시간 추이
        </Typography>
        <Box sx={{ height: isMobile ? 300 : 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{ value: '수면 시간 (시간)', angle: -90, position: 'insideLeft' }}
                domain={[0, 12]}
              />
              <Tooltip
                formatter={(value: number) => [`${value}시간`, '수면 시간']}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sleepDuration"
                name="수면 시간"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          최근 수면 기록
        </Typography>
        {chartData.map((data, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle1">{data.date}</Typography>
            <Typography variant="body2" color="text.secondary">
              취침: {data.sleepTime} | 기상: {data.wakeTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              수면 시간: {data.sleepDuration}시간
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  )
} 
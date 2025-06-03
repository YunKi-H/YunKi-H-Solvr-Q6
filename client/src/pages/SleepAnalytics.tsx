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
      console.log('데이터 불러오기 시작')
      try {
        console.log('API 호출 시도')
        const response = await api.get('/sleep-records')
        console.log('API 응답:', response)
        
        if (!response.data) {
          console.error('데이터가 없습니다')
          return
        }
        
        const data = response.data
        console.log('받아온 데이터:', data)
        setRecords(data)
        
        if (data.length === 0) {
          console.log('수면 기록이 없습니다')
          setChartData([])
          return
        }
        
        // 날짜순으로 정렬
        const sortedRecords = [...data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        
        // 최근 7일 데이터만 사용
        const recentRecords = sortedRecords.slice(-7)
        console.log('최근 7일 데이터:', recentRecords)
        
        const formattedData = recentRecords.map((record: SleepRecord) => {
          console.log('기록 처리 중:', record)
          const sleepDate = new Date(`${record.date}T${record.sleepTime}`)
          let wakeDate = new Date(`${record.date}T${record.wakeTime}`)
          
          // 기상 시간이 취침 시간보다 이전이면 다음날로 설정
          if (wakeDate < sleepDate) {
            wakeDate = new Date(wakeDate.getTime() + 24 * 60 * 60 * 1000)
          }
          
          const duration = (wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60)
          const formattedRecord = {
            date: format(new Date(record.date), 'MM/dd', { locale: ko }),
            sleepDuration: Number(duration.toFixed(1)),
            sleepTime: record.sleepTime,
            wakeTime: record.wakeTime
          }
          console.log('변환된 데이터:', formattedRecord)
          return formattedRecord
        })
        
        console.log('최종 차트 데이터:', formattedData)
        setChartData(formattedData)
      } catch (error: any) {
        console.error('수면 기록을 불러오는데 실패했습니다:', error)
        if (error.response) {
          console.error('에러 응답:', error.response.data)
          console.error('에러 상태:', error.response.status)
        }
      }
    }

    console.log('현재 사용자:', user)
    if (user) {
      fetchRecords()
    } else {
      console.log('사용자가 로그인되어 있지 않습니다')
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
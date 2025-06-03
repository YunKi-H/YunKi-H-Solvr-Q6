import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import SleepRecordForm from '../components/SleepRecordForm'

interface SleepRecord {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  notes: string | null
}

export default function SleepTracker() {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SleepRecord | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/sleep-records')
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      console.error('수면 기록을 불러오는데 실패했습니다:', error)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (data: Omit<SleepRecord, 'id'>) => {
    try {
      const url = editingRecord
        ? `/api/sleep-records/${editingRecord.id}`
        : '/api/sleep-records'
      const method = editingRecord ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingRecord(null)
        fetchRecords()
      }
    } catch (error) {
      console.error('수면 기록 저장에 실패했습니다:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 수면 기록을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/sleep-records/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchRecords()
      }
    } catch (error) {
      console.error('수면 기록 삭제에 실패했습니다:', error)
    }
  }

  const handleEdit = (record: SleepRecord) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          수면 기록
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setShowForm(true)
            setEditingRecord(null)
          }}
          size={isMobile ? "small" : "medium"}
        >
          기록 추가
        </Button>
      </Box>

      {showForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <SleepRecordForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingRecord(null)
              }}
              initialData={editingRecord}
            />
          </CardContent>
        </Card>
      )}

      {records.map((record) => (
        <Card key={record.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div">
                  {new Date(record.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  취침: {record.sleepTime} | 기상: {record.wakeTime}
                </Typography>
                {record.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {record.notes}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={() => handleEdit(record)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={() => handleDelete(record.id)}
                >
                  <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  )
} 
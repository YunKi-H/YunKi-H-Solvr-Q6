import { useState, useEffect } from 'react'
import { Container, Typography, Button, Box, Card, CardContent, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import SleepRecordForm from '../components/SleepRecordForm'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

interface SleepRecord {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  notes: string | null
}

interface SleepRecordFormData {
  date: string
  sleepTime: string
  wakeTime: string
  notes?: string
}

export default function SleepTracker() {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SleepRecord | null>(null)

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sleep-records')
      if (!response.ok) throw new Error('기록을 불러오는데 실패했습니다.')
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      console.error('기록 불러오기 오류:', error)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (data: SleepRecordFormData) => {
    try {
      const url = editingRecord
        ? `http://localhost:3000/api/sleep-records/${editingRecord.id}`
        : 'http://localhost:3000/api/sleep-records'
      
      const response = await fetch(url, {
        method: editingRecord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('기록 저장에 실패했습니다.')
      
      setShowForm(false)
      setEditingRecord(null)
      fetchRecords()
    } catch (error) {
      console.error('기록 저장 오류:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 기록을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`http://localhost:3000/api/sleep-records/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('기록 삭제에 실패했습니다.')
      
      fetchRecords()
    } catch (error) {
      console.error('기록 삭제 오류:', error)
    }
  }

  const handleEdit = (record: SleepRecord) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          수면 기록
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditingRecord(null)
            setShowForm(true)
          }}
        >
          새 기록 추가
        </Button>
      </Box>

      {showForm && (
        <Box sx={{ mb: 4 }}>
          <SleepRecordForm
            onSubmit={handleSubmit}
            initialData={editingRecord ? {
              date: editingRecord.date,
              sleepTime: editingRecord.sleepTime,
              wakeTime: editingRecord.wakeTime,
              notes: editingRecord.notes || undefined
            } : undefined}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {records.map((record) => (
          <Card key={record.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">
                    {format(new Date(record.date), 'yyyy년 MM월 dd일', { locale: ko })}
                  </Typography>
                  <Typography color="text.secondary">
                    취침: {record.sleepTime} | 기상: {record.wakeTime}
                  </Typography>
                  {record.notes && (
                    <Typography sx={{ mt: 1 }}>{record.notes}</Typography>
                  )}
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(record)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(record.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
} 
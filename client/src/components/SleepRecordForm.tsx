import { useState } from 'react'
import { Button, TextField, Box, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

interface SleepRecordFormProps {
  onSubmit: (data: {
    date: string
    sleepTime: string
    wakeTime: string
    notes?: string
  }) => void
  initialData?: {
    date: string
    sleepTime: string
    wakeTime: string
    notes?: string
  }
}

export default function SleepRecordForm({ onSubmit, initialData }: SleepRecordFormProps) {
  const [date, setDate] = useState<Date | null>(initialData ? new Date(initialData.date) : new Date())
  const [sleepTime, setSleepTime] = useState<Date | null>(
    initialData ? new Date(`2000-01-01T${initialData.sleepTime}`) : null
  )
  const [wakeTime, setWakeTime] = useState<Date | null>(
    initialData ? new Date(`2000-01-01T${initialData.wakeTime}`) : null
  )
  const [notes, setNotes] = useState(initialData?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !sleepTime || !wakeTime) return

    onSubmit({
      date: format(date, 'yyyy-MM-dd'),
      sleepTime: format(sleepTime, 'HH:mm'),
      wakeTime: format(wakeTime, 'HH:mm'),
      notes: notes || undefined
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        수면 기록 {initialData ? '수정' : '추가'}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <Box sx={{ mb: 2 }}>
          <DatePicker
            label="날짜"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ width: '100%' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TimePicker
            label="취침 시간"
            value={sleepTime}
            onChange={(newValue) => setSleepTime(newValue)}
            sx={{ width: '100%' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TimePicker
            label="기상 시간"
            value={wakeTime}
            onChange={(newValue) => setWakeTime(newValue)}
            sx={{ width: '100%' }}
          />
        </Box>
      </LocalizationProvider>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="특이사항"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!date || !sleepTime || !wakeTime}
      >
        {initialData ? '수정하기' : '추가하기'}
      </Button>
    </Box>
  )
} 
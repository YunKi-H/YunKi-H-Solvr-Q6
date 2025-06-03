import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ko } from 'date-fns/locale/ko'

interface SleepRecordFormData {
  date: string
  sleepTime: string
  wakeTime: string
  notes: string | null
}

interface Props {
  onSubmit: (data: SleepRecordFormData) => void
  onCancel: () => void
  initialData?: SleepRecordFormData
}

export default function SleepRecordForm({ onSubmit, onCancel, initialData }: Props) {
  const [date, setDate] = useState<Date | null>(initialData ? new Date(initialData.date) : new Date())
  const [sleepTime, setSleepTime] = useState<Date | null>(
    initialData ? new Date(`2000-01-01T${initialData.sleepTime}`) : null
  )
  const [wakeTime, setWakeTime] = useState<Date | null>(
    initialData ? new Date(`2000-01-01T${initialData.wakeTime}`) : null
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !sleepTime || !wakeTime) return

    onSubmit({
      date: date.toISOString().split('T')[0],
      sleepTime: sleepTime.toTimeString().slice(0, 5),
      wakeTime: wakeTime.toTimeString().slice(0, 5),
      notes: notes || null
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <DatePicker
              label="날짜"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: isMobile ? "small" : "medium"
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TimePicker
                label="취침 시간"
                value={sleepTime}
                onChange={(newValue) => setSleepTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: isMobile ? "small" : "medium"
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TimePicker
                label="기상 시간"
                value={wakeTime}
                onChange={(newValue) => setWakeTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: isMobile ? "small" : "medium"
                  }
                }}
              />
            </Box>
          </Box>
          <Box>
            <TextField
              label="특이사항"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              onClick={onCancel}
              size={isMobile ? "small" : "medium"}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              size={isMobile ? "small" : "medium"}
            >
              저장
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
} 
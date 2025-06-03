import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

interface SleepRecord {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  notes?: string
}

interface SleepRecordListProps {
  records: SleepRecord[]
  onEdit: (record: SleepRecord) => void
  onDelete: (id: number) => void
}

export default function SleepRecordList({ records, onEdit, onDelete }: SleepRecordListProps) {
  if (records.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          아직 수면 기록이 없습니다.
        </Typography>
      </Box>
    )
  }

  return (
    <List sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      {records.map((record) => (
        <Paper
          key={record.id}
          elevation={1}
          sx={{ mb: 2, p: 2 }}
        >
          <ListItem
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(record)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(record.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={format(new Date(record.date), 'yyyy년 MM월 dd일', { locale: ko })}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    취침: {record.sleepTime} | 기상: {record.wakeTime}
                  </Typography>
                  {record.notes && (
                    <Typography
                      component="p"
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {record.notes}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  )
} 
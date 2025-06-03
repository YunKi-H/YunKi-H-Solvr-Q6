import { UserService } from '../services/userService'
import { SleepRecordService } from '../services/sleepRecordService'

export interface AppContext {
  userService: UserService
  sleepRecordService: SleepRecordService
}

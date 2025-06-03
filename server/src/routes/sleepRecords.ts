import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createSleepRecordController } from '../controllers/sleepRecordController'
import { SleepRecordService } from '../services/sleepRecordService'

// 수면 기록 관련 라우트 등록
export const createSleepRecordRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const sleepRecordService = new SleepRecordService()
  const sleepRecordController = createSleepRecordController(sleepRecordService)

  // 수면 기록 생성
  fastify.post('/', sleepRecordController.createRecord)

  // 수면 기록 목록 조회
  fastify.get('/', sleepRecordController.getRecords)

  // 수면 기록 수정
  fastify.put('/:id', sleepRecordController.updateRecord)

  // 수면 기록 삭제
  fastify.delete('/:id', sleepRecordController.deleteRecord)
} 
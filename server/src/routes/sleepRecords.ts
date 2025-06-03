import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AppContext } from '../types/context.js'
import { AIAnalysisService } from '../services/aiAnalysisService.js'

const createSleepRecordSchema = z.object({
  date: z.string(),
  sleepTime: z.string(),
  wakeTime: z.string(),
  notes: z.string().nullable()
})

const updateSleepRecordSchema = createSleepRecordSchema.partial()

export function createSleepRecordRoutes(context: AppContext) {
  return async (fastify: FastifyInstance) => {
    // 수면 기록 생성
    fastify.post('/', async (request, reply) => {
      const userId = request.user.id
      const data = createSleepRecordSchema.parse(request.body)
      
      const record = await context.sleepRecordService.createRecord({
        userId,
        ...data
      })
      
      return record
    })

    // 수면 기록 조회
    fastify.get('/', async (request, reply) => {
      const userId = request.user.id
      const records = await context.sleepRecordService.getRecordsByUserId(userId)
      return records
    })

    // 수면 기록 수정
    fastify.put('/:id', async (request, reply) => {
      const userId = request.user.id
      const { id } = request.params as { id: string }
      const data = updateSleepRecordSchema.parse(request.body)
      
      const record = await context.sleepRecordService.updateRecord(
        parseInt(id),
        userId,
        data
      )
      
      if (!record) {
        reply.code(404)
        return { error: '수면 기록을 찾을 수 없습니다.' }
      }
      
      return record
    })

    // 수면 기록 삭제
    fastify.delete('/:id', async (request, reply) => {
      const userId = request.user.id
      const { id } = request.params as { id: string }
      
      const success = await context.sleepRecordService.deleteRecord(
        parseInt(id),
        userId
      )
      
      if (!success) {
        reply.code(404)
        return { error: '수면 기록을 찾을 수 없습니다.' }
      }
      
      return { success: true }
    })

    // AI 분석 엔드포인트 추가
    fastify.get('/analysis', async (request, reply) => {
      try {
        const userId = request.user.id
        const records = await context.sleepRecordService.getRecordsByUserId(userId)
        const aiAnalysis = new AIAnalysisService()
        const analysis = await aiAnalysis.analyzeSleepPattern(records)
        return { analysis }
      } catch (error) {
        console.error('수면 패턴 분석 중 오류 발생:', error)
        reply.status(500).send({ error: '수면 패턴 분석에 실패했습니다.' })
      }
    })
  }
} 
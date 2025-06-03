import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { SleepRecordService } from '../services/sleepRecordService'

const createRecordSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sleepTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  wakeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  notes: z.string().optional()
})

const updateRecordSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sleepTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  wakeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  notes: z.string().optional()
})

export const createSleepRecordController = (sleepRecordService: SleepRecordService) => ({
  // 수면 기록 생성
  async createRecord(request: FastifyRequest<{ Body: z.infer<typeof createRecordSchema> }>, reply: FastifyReply) {
    try {
      const validatedData = createRecordSchema.parse(request.body)
      const record = await sleepRecordService.createRecord({
        userId: request.user.id,
        ...validatedData
      })
      return reply.code(201).send(record)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors })
      }
      return reply.code(500).send({ error: '서버 오류가 발생했습니다.' })
    }
  },

  // 수면 기록 목록 조회
  async getRecords(request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await sleepRecordService.getRecordsByUserId(request.user.id)
      return records
    } catch (error) {
      return reply.code(500).send({ error: '서버 오류가 발생했습니다.' })
    }
  },

  // 수면 기록 수정
  async updateRecord(
    request: FastifyRequest<{
      Params: { id: string }
      Body: z.infer<typeof updateRecordSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = updateRecordSchema.parse(request.body)
      const record = await sleepRecordService.updateRecord(
        parseInt(request.params.id),
        request.user.id,
        validatedData
      )

      if (!record) {
        return reply.code(404).send({ error: '기록을 찾을 수 없습니다.' })
      }

      return record
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors })
      }
      return reply.code(500).send({ error: '서버 오류가 발생했습니다.' })
    }
  },

  // 수면 기록 삭제
  async deleteRecord(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const success = await sleepRecordService.deleteRecord(
        parseInt(request.params.id),
        request.user.id
      )

      if (!success) {
        return reply.code(404).send({ error: '기록을 찾을 수 없습니다.' })
      }

      return reply.code(204).send()
    } catch (error) {
      return reply.code(500).send({ error: '서버 오류가 발생했습니다.' })
    }
  }
}) 
import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import healthRoutes from './healthRoutes'
import { createSleepRecordRoutes } from './sleepRecords'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 헬스 체크 라우트
  fastify.register(healthRoutes, { prefix: '/api/health' })

  // 사용자 관련 라우트
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })

  // 수면 기록 라우트
  fastify.register(createSleepRecordRoutes(context), { prefix: '/api/sleep-records' })
}

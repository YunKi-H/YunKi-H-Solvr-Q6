import fastify from 'fastify'
import { createRoutes } from './routes'
import { createUserService } from './services/userService'
import { SleepRecordService } from './services/sleepRecordService'
import { getDb } from './db'

const app = fastify({
  logger: true
})

// 인증 미들웨어
app.addHook('preHandler', async (request, reply) => {
  // TODO: 실제 인증 로직 구현
  request.user = { id: 1 } // 임시로 사용자 ID 1 사용
})

// 서버 시작
const start = async () => {
  try {
    // 서비스 초기화
    const db = await getDb()
    const userService = createUserService({ db })
    const sleepRecordService = new SleepRecordService()

    // 컨텍스트 생성
    const context = {
      userService,
      sleepRecordService
    }

    // 라우트 등록
    app.register(createRoutes(context))

    await app.listen({ port: 8000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

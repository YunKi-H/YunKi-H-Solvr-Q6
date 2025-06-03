import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 사용자 테이블 스키마
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['ADMIN', 'USER', 'GUEST'] })
    .notNull()
    .default('USER'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 수면 기록 테이블 스키마
export const sleepRecords = sqliteTable('sleep_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  date: text('date').notNull(), // YYYY-MM-DD 형식
  sleepTime: text('sleep_time').notNull(), // HH:mm 형식
  wakeTime: text('wake_time').notNull(), // HH:mm 형식
  notes: text('notes'), // 선택적 특이사항
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 사용자 타입 정의
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>

// 수면 기록 타입 정의
export type SleepRecord = typeof sleepRecords.$inferSelect
export type NewSleepRecord = typeof sleepRecords.$inferInsert
export type UpdateSleepRecord = Partial<Omit<NewSleepRecord, 'id' | 'createdAt'>>

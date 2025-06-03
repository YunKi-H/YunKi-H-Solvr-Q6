import { getDb } from '../db'
import { sleepRecords } from '../db/schema'
import { eq } from 'drizzle-orm'

export interface SleepRecord {
  id: number
  userId: number
  date: string
  sleepTime: string
  wakeTime: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSleepRecordInput {
  userId: number
  date: string
  sleepTime: string
  wakeTime: string
  notes?: string
}

export interface UpdateSleepRecordInput {
  date?: string
  sleepTime?: string
  wakeTime?: string
  notes?: string
}

export class SleepRecordService {
  async createRecord(input: CreateSleepRecordInput): Promise<SleepRecord> {
    const db = await getDb()
    const [record] = await db.insert(sleepRecords).values(input).returning()
    return record
  }

  async getRecordsByUserId(userId: number): Promise<SleepRecord[]> {
    const db = await getDb()
    return db.select().from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sleepRecords.date)
  }

  async updateRecord(id: number, userId: number, input: UpdateSleepRecordInput): Promise<SleepRecord | null> {
    const db = await getDb()
    const [record] = await db.update(sleepRecords)
      .set({
        ...input,
        updatedAt: new Date().toISOString()
      })
      .where(eq(sleepRecords.id, id))
      .where(eq(sleepRecords.userId, userId))
      .returning()
    return record || null
  }

  async deleteRecord(id: number, userId: number): Promise<boolean> {
    const db = await getDb()
    const [record] = await db.delete(sleepRecords)
      .where(eq(sleepRecords.id, id))
      .where(eq(sleepRecords.userId, userId))
      .returning()
    return !!record
  }
} 
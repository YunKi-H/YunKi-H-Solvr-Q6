import { getDb } from './index'
import { sleepRecords } from './schema'

async function seed() {
  const db = await getDb()
  
  // 기존 데이터 삭제
  await db.delete(sleepRecords)
  
  // 테스트 데이터 추가
  await db.insert(sleepRecords).values([
    {
      userId: 1,
      date: '2024-03-01',
      sleepTime: '23:00',
      wakeTime: '07:00',
      notes: '잘 잤음',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-02',
      sleepTime: '22:30',
      wakeTime: '06:30',
      notes: '조금 피곤함',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-03',
      sleepTime: '23:30',
      wakeTime: '08:00',
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-04',
      sleepTime: '22:00',
      wakeTime: '06:00',
      notes: '일찍 일어남',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-05',
      sleepTime: '00:00',
      wakeTime: '07:30',
      notes: '늦게 잠',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-06',
      sleepTime: '23:00',
      wakeTime: '07:00',
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      userId: 1,
      date: '2024-03-07',
      sleepTime: '22:30',
      wakeTime: '06:30',
      notes: '평소와 동일',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])
  
  console.log('시드 데이터가 성공적으로 추가되었습니다.')
}

seed().catch(console.error) 
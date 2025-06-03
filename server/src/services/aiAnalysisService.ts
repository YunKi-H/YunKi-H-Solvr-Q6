import { GoogleGenerativeAI } from '@google/generative-ai'
import { SleepRecord } from './sleepRecordService.js'

export class AIAnalysisService {
  private ai: GoogleGenerativeAI

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.')
    }
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  async analyzeSleepPattern(records: SleepRecord[]): Promise<string> {
    if (!records || records.length === 0) {
      return '분석할 수면 기록이 없습니다.'
    }

    const model = this.ai.getGenerativeModel({ model: 'gemma-3-1b-it' })
    const config = {
      responseMimeType: 'text/plain',
    }

    // 수면 데이터를 분석하기 쉬운 형태로 변환
    const sleepData = records.map(record => ({
      date: record.date,
      sleepTime: record.sleepTime,
      wakeTime: record.wakeTime,
      duration: this.calculateDuration(record.sleepTime, record.wakeTime),
      notes: record.notes
    }))

    const prompt = `
수면 기록 데이터를 분석해주세요:

${JSON.stringify(sleepData, null, 2)}

다음 항목에 대해 간단히 분석해주세요:
1. 수면 패턴의 일관성
2. 수면 시간의 충분성
3. 개선 제안

답변은 500자 이내로 간단히 작성해주세요.`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    if (!result || !result.response) {
      throw new Error('AI 응답이 올바르지 않습니다.')
    }

    return result.response.text()
  }

  private calculateDuration(sleepTime: string, wakeTime: string): number {
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number)
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number)
    
    let sleepDate = new Date()
    sleepDate.setHours(sleepHour, sleepMinute, 0)
    
    let wakeDate = new Date()
    wakeDate.setHours(wakeHour, wakeMinute, 0)
    
    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1)
    }
    
    const duration = (wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60)
    return Number(duration.toFixed(1))
  }
} 
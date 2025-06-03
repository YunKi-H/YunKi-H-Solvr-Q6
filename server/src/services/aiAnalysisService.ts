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
다음은 사용자의 수면 기록 데이터입니다. 이 데이터를 분석하여 수면 패턴에 대한 인사이트와 개선을 위한 조언을 제공해주세요.
데이터는 JSON 형식으로 제공되며, 각 기록은 날짜, 취침 시간, 기상 시간, 수면 시간(시간 단위), 그리고 특이사항을 포함합니다.

수면 데이터:
${JSON.stringify(sleepData, null, 2)}

다음과 같은 관점에서 분석해주세요:
1. 전반적인 수면 패턴 (취침/기상 시간의 일관성)
2. 수면 시간의 충분성
3. 수면의 질에 영향을 줄 수 있는 요인
4. 개선을 위한 구체적인 제안

분석은 한국어로 작성해주세요.`

    try {
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      })

      let fullResponse = ''
      for await (const chunk of result.stream) {
        if (chunk.text) {
          fullResponse += chunk.text
        }
      }

      if (!fullResponse) {
        throw new Error('AI 응답이 올바르지 않습니다.')
      }

      return fullResponse
    } catch (error) {
      console.error('AI 분석 중 오류 발생:', error)
      throw new Error('수면 패턴 분석에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
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
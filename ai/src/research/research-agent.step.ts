import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { retryWithBackoff } from '../utils/retry-helper'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const config = {
  type: 'event',
  name: 'ResearchAgent',
  description: 'AI agent that conducts research based on the plan',
  flows: ['ai-research-agent'],
  subscribes: ['plan.completed'],
  emits: ['research.completed'],
  
  input: z.object({
    researchId: z.string(),
    query: z.string(),
    depth: z.string(),
    plan: z.object({
      research_topics: z.array(z.string()),
      key_questions: z.array(z.string()),
      approach: z.string(),
      estimated_time: z.number().optional(),
    }),
  }),
} as const

export const handler: Handlers['ResearchAgent'] = async (input, { emit, logger, state }) => {
  const { researchId, query, plan } = input

  logger.info('[ResearchAgent] Starting research', { 
    researchId, 
    topics: plan.research_topics.length 
  })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Simulate research for each topic
    const findings: any[] = []

    for (const topic of plan.research_topics) {
      logger.info('[ResearchAgent] Researching topic', { researchId, topic })

      const prompt = `You are a research AI agent. Research the following topic in the context of this query:

Main Query: "${query}"
Research Topic: "${topic}"

Provide comprehensive findings in JSON format:
{
  "topic": "${topic}",
  "summary": "2-3 paragraph summary of findings",
  "key_points": ["point1", "point2", "point3"],
  "sources": ["source1", "source2"],
  "confidence": 0.85
}

Respond ONLY with valid JSON, no markdown formatting.`

      const result = await retryWithBackoff(
        async () => await model.generateContent(prompt),
        { maxRetries: 5, initialDelay: 2000 }
      )
      const text = result.response.text()
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const finding = JSON.parse(cleanText)
      
      findings.push(finding)

      // Add delay between API calls to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    logger.info('[ResearchAgent] Research completed', { 
      researchId, 
      findingsCount: findings.length 
    })

    // Update research state
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      findings,
      progress: {
        ...researchData.progress,
        research: 'completed',
      },
    })

    // Store findings
    await state.set('research-findings', researchId, findings)

    // Emit event to trigger analysis agent
    await emit({
      topic: 'research.completed',
      data: {
        researchId,
        query,
        plan,
        findings,
      },
    })

    logger.info('[ResearchAgent] Findings emitted for analysis', { researchId })

  } catch (error: any) {
    logger.error('[ResearchAgent] Error during research', { 
      researchId, 
      error: error.message 
    })

    const isQuotaError = error.message?.includes('Daily API quota exceeded') ||
                         error.message?.includes('RequestsPerDay')
    
    const userMessage = isQuotaError
      ? 'Daily API quota exceeded. Please try again after midnight Pacific Time.'
      : error.message

    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      status: 'failed',
      progress: {
        ...researchData.progress,
        research: 'failed',
      },
      error: userMessage,
    })
  }
}

import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { retryWithBackoff } from '../utils/retry-helper'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const config = {
  type: 'event',
  name: 'PlanningAgent',
  description: 'AI agent that creates a research plan',
  flows: ['ai-research-agent'],
  subscribes: ['research.started'],
  emits: ['plan.completed'],
  
  input: z.object({
    researchId: z.string(),
    query: z.string(),
    depth: z.string(),
  }),
} as const

export const handler: Handlers['PlanningAgent'] = async (input, { emit, logger, state }) => {
  const { researchId, query, depth } = input

  logger.info('[PlanningAgent] Creating research plan', { researchId, query })

  try {
    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a research planning AI agent. Create a structured research plan for the following query:

Query: "${query}"
Depth: ${depth}

Generate a JSON response with:
1. "research_topics": array of 3-5 specific topics to research
2. "key_questions": array of 3-5 key questions to answer
3. "approach": brief description of the research approach
4. "estimated_time": estimated time in minutes

Respond ONLY with valid JSON, no markdown formatting.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Parse JSON response (remove markdown if present)
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plan = JSON.parse(cleanText)

    logger.info('[PlanningAgent] Research plan created', { 
      researchId, 
      topics: plan.research_topics?.length 
    })

    // Update research state
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      plan,
      progress: {
        ...researchData.progress,
        planning: 'completed',
      },
    })

    // Store the plan
    await state.set('research-plans', researchId, plan)

    // Emit event to trigger research agent
    await emit({
      topic: 'plan.completed',
      data: {
        researchId,
        query,
        depth,
        plan,
      },
    })

    logger.info('[PlanningAgent] Plan completed and emitted', { researchId })

  } catch (error: any) {
    logger.error('[PlanningAgent] Error creating plan', { 
      researchId, 
      error: error.message 
    })

    const isQuotaError = error.message?.includes('Daily API quota exceeded') ||
                         error.message?.includes('RequestsPerDay')
    
    const userMessage = isQuotaError
      ? 'Daily API quota exceeded. Please try again after midnight Pacific Time.'
      : error.message

    // Update state with error
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      status: 'failed',
      progress: {
        ...researchData.progress,
        planning: 'failed',
      },
      error: userMessage,
    })
  }
}

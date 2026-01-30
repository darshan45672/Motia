import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { retryWithBackoff } from '../utils/retry-helper'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const config = {
  type: 'event',
  name: 'AnalysisAgent',
  description: 'AI agent that analyzes research findings',
  flows: ['ai-research-agent'],
  subscribes: ['research.completed'],
  emits: ['analysis.completed'],
  
  input: z.object({
    researchId: z.string(),
    query: z.string(),
    plan: z.any(),
    findings: z.array(z.any()),
  }),
} as const

export const handler: Handlers['AnalysisAgent'] = async (input, { emit, logger, state }) => {
  const { researchId, query, findings } = input

  logger.info('[AnalysisAgent] Analyzing findings', { 
    researchId, 
    findingsCount: findings.length 
  })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const findingsSummary = findings.map((f: any) => 
      `Topic: ${f.topic}\nSummary: ${f.summary}\nKey Points: ${f.key_points.join(', ')}`
    ).join('\n\n')

    const prompt = `You are an analysis AI agent. Analyze the following research findings for this query:

Query: "${query}"

Research Findings:
${findingsSummary}

Provide a comprehensive analysis in JSON format:
{
  "overall_assessment": "2-3 paragraph analysis of all findings",
  "key_insights": ["insight1", "insight2", "insight3"],
  "patterns_identified": ["pattern1", "pattern2"],
  "gaps": ["gap1", "gap2"],
  "confidence_score": 0.85,
  "recommendations": ["rec1", "rec2"]
}

Respond ONLY with valid JSON, no markdown formatting.`

    const result = await retryWithBackoff(
      async () => await model.generateContent(prompt),
      { maxRetries: 5, initialDelay: 2000 }
    )
    const text = result.response.text()
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    logger.info('[AnalysisAgent] Analysis completed', { 
      researchId, 
      insights: analysis.key_insights?.length 
    })

    // Update research state
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      analysis,
      progress: {
        ...researchData.progress,
        analysis: 'completed',
      },
    })

    // Store analysis
    await state.set('research-analysis', researchId, analysis)

    // Emit event to trigger synthesis agent
    await emit({
      topic: 'analysis.completed',
      data: {
        researchId,
        query,
        findings,
        analysis,
      },
    })

    logger.info('[AnalysisAgent] Analysis emitted for synthesis', { researchId })

  } catch (error: any) {
    logger.error('[AnalysisAgent] Error during analysis', { 
      researchId, 
      error: error.message 
    })

    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      progress: {
        ...researchData.progress,
        analysis: 'failed',
      },
      error: error.message,
    })
  }
}

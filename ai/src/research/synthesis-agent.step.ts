import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { retryWithBackoff } from '../utils/retry-helper'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const config = {
  type: 'event',
  name: 'SynthesisAgent',
  description: 'AI agent that generates the final research report',
  flows: ['ai-research-agent'],
  subscribes: ['analysis.completed'],
  emits: ['report.completed'],
  
  input: z.object({
    researchId: z.string(),
    query: z.string(),
    findings: z.array(z.any()),
    analysis: z.any(),
  }),
} as const

export const handler: Handlers['SynthesisAgent'] = async (input, { emit, logger, state }) => {
  const { researchId, query, findings, analysis } = input
  
  // Type assertion for analysis object
  const analysisData = analysis as {
    overall_assessment: string
    key_insights?: string[]
    patterns_identified?: string[]
    recommendations?: string[]
    confidence_score?: number
  }

  logger.info('[SynthesisAgent] Generating final report', { researchId })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const context = `
Query: "${query}"

Analysis Summary:
${analysisData.overall_assessment}

Key Insights: ${analysisData.key_insights?.join(', ')}
Patterns: ${analysisData.patterns_identified?.join(', ')}
Recommendations: ${analysisData.recommendations?.join(', ')}

Number of findings: ${findings.length}
`

    const prompt = `You are a synthesis AI agent. Create a comprehensive, well-structured research report based on the analysis:

${context}

Generate a complete research report in JSON format:
{
  "title": "Research Report: [Topic]",
  "executive_summary": "2-3 paragraph summary",
  "methodology": "Brief description of research approach",
  "findings_summary": "Comprehensive summary of all findings",
  "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "conclusions": "Final conclusions paragraph",
  "next_steps": ["step1", "step2", "step3"],
  "confidence_level": "high/medium/low",
  "generated_at": "${new Date().toISOString()}"
}

Respond ONLY with valid JSON, no markdown formatting.`

    const result = await retryWithBackoff(
      async () => await model.generateContent(prompt),
      { maxRetries: 5, initialDelay: 2000 }
    )
    const text = result.response.text()
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const report = JSON.parse(cleanText)

    logger.info('[SynthesisAgent] Report generated', { 
      researchId, 
      title: report.title 
    })

    // Update research state to completed
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      report,
      status: 'completed',
      completedAt: new Date().toISOString(),
      progress: {
        ...researchData.progress,
        synthesis: 'completed',
      },
    })

    // Store final report
    await state.set('research-reports', researchId, report)

    // Emit final event
    await emit({
      topic: 'report.completed',
      data: {
        researchId,
        query,
        report,
      },
    })

    logger.info('[SynthesisAgent] Research workflow completed', { researchId })

  } catch (error: any) {
    logger.error('[SynthesisAgent] Error generating report', { 
      researchId, 
      error: error.message 
    })

    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      status: 'failed',
      progress: {
        ...researchData.progress,
        synthesis: 'failed',
      },
      error: error.message,
    })
  }
}

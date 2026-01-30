import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config = {
  type: 'api',
  name: 'ResearchStatusAPI',
  description: 'Check the status and results of a research workflow',
  method: 'GET',
  path: '/research/:researchId/status',
  flows: ['ai-research-agent'],
  emits: [],
  
  responseSchema: {
    200: z.object({
      researchId: z.string(),
      query: z.string(),
      status: z.string(),
      progress: z.object({
        planning: z.string(),
        research: z.string(),
        analysis: z.string(),
        synthesis: z.string(),
      }),
      report: z.any().optional(),
      createdAt: z.string(),
      completedAt: z.string().optional(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
} as const

export const handler: Handlers['ResearchStatusAPI'] = async (req, { logger, state }) => {
  const { researchId } = req.pathParams

  logger.info('[ResearchStatusAPI] Checking research status', { researchId })

  const researchData = await state.get('research', researchId) as any

  if (!researchData) {
    logger.warn('[ResearchStatusAPI] Research not found', { researchId })
    return {
      status: 404,
      body: { error: 'Research not found' },
    }
  }

  // Get additional details if completed
  let fullData = { ...researchData }

  if (researchData.status === 'completed') {
    const plan = await state.get('research-plans', researchId)
    const findings = await state.get('research-findings', researchId)
    const analysis = await state.get('research-analysis', researchId)
    const report = await state.get('research-reports', researchId)

    fullData = {
      ...fullData,
      plan,
      findings,
      analysis,
      report,
    }
  }

  logger.info('[ResearchStatusAPI] Status retrieved', { 
    researchId, 
    status: researchData.status 
  })

  return {
    status: 200,
    body: fullData,
  }
}

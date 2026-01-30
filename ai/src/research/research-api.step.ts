import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config = {
  type: 'api',
  name: 'ResearchAPI',
  description: 'Initiate AI-powered research workflow',
  method: 'POST',
  path: '/research',
  flows: ['ai-research-agent'],
  emits: ['research.started'],
  
  bodySchema: z.object({
    query: z.string().min(5, 'Query must be at least 5 characters'),
    depth: z.enum(['quick', 'standard', 'deep']).default('standard'),
  }),

  responseSchema: {
    202: z.object({
      researchId: z.string(),
      query: z.string(),
      depth: z.string(),
      status: z.string(),
      message: z.string(),
    }),
  },
} as const

export const handler: Handlers['ResearchAPI'] = async (req, { emit, logger, state }) => {
  const { query, depth } = req.body

  logger.info('[ResearchAPI] Starting research workflow', { query, depth })

  // Generate research ID
  const researchId = `research-${Date.now()}`

  // Store initial research state
  const researchData = {
    researchId,
    query,
    depth,
    status: 'initiated',
    createdAt: new Date().toISOString(),
    progress: {
      planning: 'pending',
      research: 'pending',
      analysis: 'pending',
      synthesis: 'pending',
    },
  }

  await state.set('research', researchId, researchData)

  // Emit event to start the agent workflow
  await emit({
    topic: 'research.started',
    data: { researchId, query, depth },
  })

  logger.info('[ResearchAPI] Research workflow initiated', { researchId })

  return {
    status: 202,
    body: {
      researchId,
      query,
      depth,
      status: 'initiated',
      message: 'Research workflow started. Use /research/{researchId}/status to check progress.',
    },
  }
}

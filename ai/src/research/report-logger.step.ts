import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config = {
  type: 'event',
  name: 'ReportLogger',
  description: 'Logs the completion of research reports',
  flows: ['ai-research-agent'],
  subscribes: ['report.completed'],
  emits: [],
  
  input: z.object({
    researchId: z.string(),
    query: z.string(),
    report: z.any(),
  }),
} as const

export const handler: Handlers['ReportLogger'] = async (input, { logger }) => {
  const { researchId, query, report } = input

  logger.info('[ReportLogger] Research workflow completed successfully', {
    researchId,
    query,
    reportTitle: report.title,
    confidenceLevel: report.confidence_level,
  })

  // This step just logs the completion
  // No further emissions needed - workflow is complete
}

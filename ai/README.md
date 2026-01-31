# AI Research Agent Workflow

A demonstration of **AI agent orchestration** using Motia's event-driven architecture with Google Gemini. This project showcases how multiple specialized AI agents can work together sequentially to complete complex research tasks.

## 🎯 What This Demonstrates

This workflow shows how to:
- **Orchestrate multiple AI agents** in a sequential pipeline using events
- **Use Google Gemini** for AI-powered task execution
- **Manage agent state** across a multi-step workflow
- **Build asynchronous AI systems** that scale

## 🤖 Agent Workflow Architecture

```
User Request (POST /research)
        ↓
    [Planning Agent]  → Creates research plan
        ↓
    [Research Agent]  → Conducts research on each topic
        ↓
    [Analysis Agent]  → Analyzes all findings
        ↓
    [Synthesis Agent] → Generates final report
        ↓
    Complete (GET /research/:id/status)
```

Each agent:
1. **Subscribes** to the previous agent's completion event
2. **Processes** the data using Google Gemini
3. **Stores** results in Redis state
4. **Emits** an event to trigger the next agent

## 🚀 Quick Start

### 1. Prerequisites

- Node.js v18+
- Redis running locally
- Google Gemini API key

### 2. Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Setup

```bash
# Install dependencies
npm install

# Configure your API key
# Edit .env file and add:
GOOGLE_API_KEY=your_actual_api_key_here

# Start Redis (if not running)
redis-server

# Start the server
npm run dev
```

## 📡 API Endpoints

### Start Research Workflow

```bash
POST http://localhost:3000/research

{
  "query": "What are the benefits and challenges of microservices architecture?",
  "depth": "standard"
}
```

**Response:**
```json
{
  "researchId": "research-1234567890",
  "query": "What are the benefits and challenges of microservices architecture?",
  "depth": "standard",
  "status": "initiated",
  "message": "Research workflow started. Use /research/{researchId}/status to check progress."
}
```

### Check Research Status

```bash
GET http://localhost:3000/research/:researchId/status
```

**Response (In Progress):**
```json
{
  "researchId": "research-1234567890",
  "query": "What are the benefits...",
  "status": "initiated",
  "progress": {
    "planning": "completed",
    "research": "completed",
    "analysis": "in-progress",
    "synthesis": "pending"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response (Completed):**
```json
{
  "researchId": "research-1234567890",
  "query": "What are the benefits...",
  "status": "completed",
  "progress": {
    "planning": "completed",
    "research": "completed",
    "analysis": "completed",
    "synthesis": "completed"
  },
  "report": {
    "title": "Research Report: Microservices Architecture",
    "executive_summary": "...",
    "key_takeaways": ["...", "...", "..."],
    "conclusions": "...",
    "next_steps": ["...", "..."]
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:35:00Z"
}
```

## 🔄 Event Flow Explained

### 1. Research API Endpoint
**File:** `src/research/research-api.step.ts`

- Accepts research query from user
- Creates initial state in Redis
- **Emits:** `research.started` event

```typescript
emits: ['research.started']

await emit({
  topic: 'research.started',
  data: { researchId, query, depth }
})
```

### 2. Planning Agent
**File:** `src/research/planning-agent.step.ts`

- **Subscribes to:** `research.started`
- Uses Gemini to create a structured research plan
- Identifies key topics, questions, and approach
- **Emits:** `plan.completed` event

```typescript
subscribes: ['research.started']
emits: ['plan.completed']

// Uses Gemini to generate:
{
  research_topics: ["topic1", "topic2", "topic3"],
  key_questions: ["q1", "q2", "q3"],
  approach: "..."
}
```

### 3. Research Agent
**File:** `src/research/research-agent.step.ts`

- **Subscribes to:** `plan.completed`
- Conducts research on each planned topic using Gemini
- Gathers findings, key points, and sources
- **Emits:** `research.completed` event

```typescript
subscribes: ['plan.completed']
emits: ['research.completed']

// For each topic, generates:
{
  topic: "...",
  summary: "...",
  key_points: ["...", "..."],
  sources: ["...", "..."],
  confidence: 0.85
}
```

### 4. Analysis Agent
**File:** `src/research/analysis-agent.step.ts`

- **Subscribes to:** `research.completed`
- Analyzes all research findings using Gemini
- Identifies patterns, insights, and gaps
- **Emits:** `analysis.completed` event

```typescript
subscribes: ['research.completed']
emits: ['analysis.completed']

// Generates:
{
  overall_assessment: "...",
  key_insights: ["...", "..."],
  patterns_identified: ["...", "..."],
  gaps: ["...", "..."],
  recommendations: ["...", "..."]
}
```

### 5. Synthesis Agent
**File:** `src/research/synthesis-agent.step.ts`

- **Subscribes to:** `analysis.completed`
- Creates comprehensive final report using Gemini
- Combines all insights into executive summary
- **Emits:** `report.completed` event (final)

```typescript
subscribes: ['analysis.completed']
emits: ['report.completed']

// Generates final report:
{
  title: "Research Report: ...",
  executive_summary: "...",
  findings_summary: "...",
  key_takeaways: ["...", "..."],
  conclusions: "...",
  next_steps: ["...", "..."]
}
```

### 6. Status API Endpoint
**File:** `src/research/status-api.step.ts`

- Provides real-time progress updates
- Returns complete results when workflow finishes
- Tracks each agent's completion status

## 🧠 Key Concepts

### API Quota Management

**Free Tier Limits (Google Gemini):**
- **20 requests per day** for gemini-2.5-flash
- Quota resets at **midnight Pacific Time**
- Per-minute limits: 5 requests per minute

**API Call Breakdown (Standard Depth):**
```
POST /research → triggers:
  1 call:  Planning Agent (create plan)
  5 calls: Research Agent (5 topics)
  1 call:  Analysis Agent (analyze findings)
  1 call:  Synthesis Agent (generate report)
  ─────────
  8 total API calls per research request
```

**Staying Within Limits:**

1. **Use "quick" depth** (3 topics instead of 5):
   ```bash
   curl -X POST http://localhost:3000/research \
     -d '{"query": "...", "depth": "quick"}'  # Only 5 API calls total
   ```

2. **Monitor your usage**:
   - Check quota: https://ai.dev/rate-limit
   - Track API calls in logs

3. **Handle quota errors gracefully**:
   - System automatically detects daily quota exceeded
   - Provides user-friendly error messages
   - No wasted retry attempts on daily limits

**Error Message:**
```json
{
  "error": "Daily API quota exceeded (20 requests/day on free tier). 
           Please try again after midnight Pacific Time or reduce research depth to 'quick'.",
  "errorDetails": {
    "suggestion": "Quota resets at midnight Pacific Time. 
                  Consider using depth: 'quick' (3 topics instead of 5) to stay within limits."
  }
}
```

**Upgrade Options:**
- **Paid Tier**: 1500 requests per day (gemini-2.5-flash)
- **Rate limits**: Higher per-minute limits
- **Visit**: https://ai.google.dev/pricing

### Sequential AI Agent Pattern

Each agent is **specialized** and **independent**:

1. **Separation of Concerns**: Each agent has a single responsibility
2. **Event-Driven**: Agents communicate only through events, not direct calls
3. **State Management**: Redis stores intermediate results for recovery
4. **Asynchronous**: The entire workflow is non-blocking
5. **Scalable**: Each agent can be scaled independently

### Why This Architecture?

✅ **Modular**: Add/remove agents without changing others  
✅ **Resilient**: Failures in one agent don't cascade  
✅ **Observable**: Track progress at each stage  
✅ **Testable**: Test each agent in isolation  
✅ **Scalable**: Distribute agents across multiple instances  

## 🎨 Customization

### Add More Agents

Want to add a "Validation Agent" between Analysis and Synthesis?

1. Create `validation-agent.step.ts`:
```typescript
export const config: EventConfig = {
  subscribes: ['analysis.completed'],
  emits: ['validation.completed'],
  // ...
}
```

2. Update Synthesis Agent to subscribe to `validation.completed`

### Change AI Model

Switch to `gemini-1.5-pro` for better performance:

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro' 
})
```

### Customize Research Depth

Adjust prompts based on depth setting:

```typescript
if (depth === 'deep') {
  // More comprehensive prompts
} else if (depth === 'quick') {
  // Faster, concise prompts
}
```

## 🔍 Testing the Workflow

### Example 1: Technology Research

```bash
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the trade-offs between SQL and NoSQL databases?",
    "depth": "standard"
  }'
```

### Example 2: Business Analysis

```bash
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What factors should startups consider when choosing a cloud provider?",
    "depth": "deep"
  }'
```

### Check Progress

```bash
# Monitor progress every few seconds
curl http://localhost:3000/research/research-1234567890/status
```

Watch the `progress` object update as each agent completes:
```
planning: pending → completed
research: pending → completed
analysis: pending → completed
synthesis: pending → completed
```

## 📊 State Management

Each agent stores its results in Redis:

```typescript
await state.set('research', researchId, data)      // Main status
await state.set('research-plans', researchId, plan)    // Plan
await state.set('research-findings', researchId, findings)  // Research
await state.set('research-analysis', researchId, analysis)  // Analysis
await state.set('research-reports', researchId, report)     // Report
```

This allows:
- **Progress tracking** at any point
- **Recovery** from failures
- **Debugging** individual agent outputs

## 🚨 Error Handling

Each agent handles errors gracefully:

```typescript
try {
  // Agent logic
} catch (error) {
  logger.error('[Agent] Error', { error: error.message })
  
  // Update state with error
  await state.set('research', researchId, {
    ...researchData,
    progress: { ...progress, [stage]: 'failed' },
    error: error.message
  })
}
```

If an agent fails:
- Error is logged
- State is updated to show failure
- Workflow stops at that stage
- User can retrieve partial results

## 🎓 Learning Resources

This implementation demonstrates:
- ✅ Event-driven architecture
- ✅ AI agent orchestration
- ✅ Sequential workflow patterns
- ✅ State management in distributed systems
- ✅ Error handling in async workflows

## 📝 Next Steps

Try extending this workflow:

1. **Add parallel research**: Research multiple topics simultaneously
2. **Implement caching**: Cache similar research queries
3. **Add webhooks**: Notify users when research completes
4. **Build UI**: Create a React dashboard to visualize progress
5. **Add more agents**: Fact-checking, citation validation, etc.

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork and extend with more agents
- Try different AI models
- Implement alternative patterns (Fan-Out, Saga)

---

**Built with Motia + Google Gemini** 🚀

## Learn More

- [Docs](https://motia.dev/docs) - Complete guides and API reference
- [Quick Start Tutorial](https://motia.dev/docs/getting-started/quick-start) - Detailed getting started tutorial
- [Core Concepts](https://motia.dev/docs/concepts/overview) - Learn about Steps and Motia's architecture
- [Discord Community](https://discord.gg/motia) - Get help and connect with other developers
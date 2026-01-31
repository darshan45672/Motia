# Motia Framework - Complete Tutorial Guide

**Three Progressive Projects:** From Simple REST APIs to Advanced AI Multi-Agent Systems

---

## 🎯 Quick Navigation

| Project | Complexity | Time | Key Concepts |
|---------|------------|------|--------------|
| [1. Task Management API](#1-task-management-rest-api) | 🟢 Beginner | 20 min | REST, CRUD, File Storage |
| [2. User Registration](#2-event-driven-user-registration) | 🟡 Intermediate | 30 min | Events, Async, State |
| [3. AI Research Agent](#3-ai-research-agent-system) | 🔴 Advanced | 45 min | Multi-Agent, AI, Pipelines |

---

## 📊 Architecture Comparison

### Visual Flow Diagrams

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROJECT 1: Task Management REST API                                         │
│ Pattern: Synchronous Request-Response                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HTTP Request                                                               │
│       ↓                                                                     │
│  ┌─────────┐     ┌──────────────┐     ┌──────────┐                        │
│  │ Client  │ ──→ │  API Handler │ ──→ │ File DB  │                        │
│  │         │ ←── │              │ ←── │          │                        │
│  └─────────┘     └──────────────┘     └──────────┘                        │
│                                                                             │
│  Response Time: < 10ms (instant)                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PROJECT 2: Event-Driven User Registration                                   │
│ Pattern: Fan-Out (Parallel Event Processing)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HTTP Request                                                               │
│       ↓                                                                     │
│  ┌─────────┐     ┌─────────────┐     Emit 'user.registered'               │
│  │ Client  │ ──→ │ Register API│ ──────────┬──────────┬─────────→         │
│  │         │ ←── │             │            │          │                   │
│  └─────────┘     └─────────────┘            │          │                   │
│                        ↓                     ↓          ↓                   │
│              (Returns immediately)    ┌───────────┐ ┌───────────┐          │
│                                       │Send Email │ │Setup Acct │          │
│                                       └─────┬─────┘ └───────────┘          │
│                                             │ Emit 'email.sent'            │
│                                             ↓                              │
│                                      ┌──────────────┐                      │
│                                      │ Log Notif.   │                      │
│                                      └──────────────┘                      │
│                                                                             │
│  Response Time: < 10ms API + 1-2s background processing                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PROJECT 3: AI Research Agent System                                         │
│ Pattern: Sequential Multi-Agent Pipeline                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HTTP Request                                                               │
│       ↓                                                                     │
│  ┌─────────┐     ┌──────────────┐     Emit 'research.started'             │
│  │ Client  │ ──→ │Research API  │ ─────────────────→                      │
│  │         │ ←── │              │                                          │
│  └─────────┘     └──────────────┘                                          │
│                        ↓ (Returns immediately)                             │
│                                                                             │
│                  ┌─────────────────────────────────┐                       │
│                  │   1. Planning Agent             │                       │
│                  │   ↓ (Gemini API: Create Plan)   │                       │
│                  │   Emit 'plan.completed'         │                       │
│                  └─────────────────────────────────┘                       │
│                               ↓                                            │
│                  ┌─────────────────────────────────┐                       │
│                  │   2. Research Agent             │                       │
│                  │   ↓ (Gemini API: 5 topics)      │                       │
│                  │   Emit 'research.completed'     │                       │
│                  └─────────────────────────────────┘                       │
│                               ↓                                            │
│                  ┌─────────────────────────────────┐                       │
│                  │   3. Analysis Agent             │                       │
│                  │   ↓ (Gemini API: Analyze)       │                       │
│                  │   Emit 'analysis.completed'     │                       │
│                  └─────────────────────────────────┘                       │
│                               ↓                                            │
│                  ┌─────────────────────────────────┐                       │
│                  │   4. Synthesis Agent            │                       │
│                  │   ↓ (Gemini API: Report)        │                       │
│                  │   Emit 'report.completed'       │                       │
│                  └─────────────────────────────────┘                       │
│                               ↓                                            │
│                  ┌─────────────────────────────────┐                       │
│                  │   5. Report Logger              │                       │
│                  │   ✓ Workflow Complete           │                       │
│                  └─────────────────────────────────┘                       │
│                                                                             │
│  Response Time: < 10ms API + 30-60s AI processing                          │
│  API Calls: 8 (1 plan + 5 research + 1 analysis + 1 synthesis)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature Matrix

| Feature | Project 1 | Project 2 | Project 3 |
|---------|-----------|-----------|-----------|
| **Execution Model** | Synchronous | Async (Parallel) | Async (Sequential) |
| **Data Persistence** | File (.data/tasks.json) | Redis State | Redis State |
| **API Endpoints** | 5 | 2 | 2 |
| **Event Handlers** | 0 | 3 | 5 |
| **External APIs** | None | None | Google Gemini |
| **Response Time** | < 10ms | < 10ms + async | < 10ms + 30-60s |
| **Scalability** | Single instance | Horizontal | Horizontal + Rate limits |
| **Error Handling** | HTTP errors | Event isolation | Retry + Quota |
| **State Management** | File-based | Redis namespaces | Redis namespaces |
| **Real-world Use Case** | CRUD apps | User workflows | AI pipelines |

### When to Use Each Pattern

| Scenario | Use Project | Reason |
|----------|-------------|--------|
| Simple data management | 1 | Direct, fast, easy to understand |
| User registration with email | 2 | Parallel processing, loose coupling |
| Multi-step AI analysis | 3 | Sequential dependencies, external APIs |
| E-commerce product catalog | 1 | CRUD operations, fast responses |
| Order processing workflow | 2 | Multiple independent steps (email, inventory, shipping) |
| Document analysis pipeline | 3 | Each step builds on previous results |
| Real-time chat API | 1 | Instant responses required |
| Social media post publishing | 2 | Notify followers, update feeds, analytics (parallel) |
| Research report generation | 3 | Gather → Analyze → Synthesize (sequential) |

---

## 1. Task Management REST API

**Duration:** 20 minutes | **Difficulty:** 🟢 Beginner

### Overview

Build a complete REST API with CRUD operations for task management using file-based storage.

### What You'll Build

- ✅ 5 REST endpoints (Create, Read, Update, Delete, List)
- ✅ Request validation with Zod schemas
- ✅ File-based JSON storage
- ✅ Proper HTTP status codes and error handling
- ✅ Timestamps and data persistence

### Quick Start

```bash
# 1. Create project
npx motia@latest create my-app
cd my-app

# 2. Create tasks directory
mkdir -p src/tasks

# 3. Copy files from tutorial
# (See implementation below)

# 4. Start server
npm run dev

# 5. Test API
curl http://localhost:3000/tasks
```

### API Reference

#### 1. Create Task
**POST** `/tasks`

Creates a new task and saves to file.

**Request Body:**
```json
{
  "title": "Complete documentation",
  "description": "Write API docs for all endpoints",
  "status": "pending"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Write API docs",
    "status": "pending"
  }'
```

**Response (201 Created):**
```json
{
  "id": "1",
  "title": "Complete documentation",
  "description": "Write API docs",
  "status": "pending",
  "createdAt": 1706435232000,
  "updatedAt": 1706435232000
}
```

---

#### 2. List All Tasks
**GET** `/tasks`

Returns all tasks sorted by most recently updated.

**cURL Example:**
```bash
curl http://localhost:3000/tasks
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "title": "Complete documentation",
    "description": "Write API docs",
    "status": "pending",
    "createdAt": 1706435232000,
    "updatedAt": 1706435232000
  },
  {
    "id": "2",
    "title": "Review pull requests",
    "description": "Check team PRs",
    "status": "in-progress",
    "createdAt": 1706435100000,
    "updatedAt": 1706435150000
  }
]
```

---

#### 3. Get Task by ID
**GET** `/tasks/:id`

Retrieves a specific task by its ID.

**cURL Example:**
```bash
curl http://localhost:3000/tasks/1
```

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Complete documentation",
  "description": "Write API docs",
  "status": "pending",
  "createdAt": 1706435232000,
  "updatedAt": 1706435232000
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

#### 4. Update Task
**PUT** `/tasks/:id`

Updates an existing task. All fields are optional.

**Request Body:**
```json
{
  "title": "Complete documentation - Updated",
  "status": "completed"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Complete documentation",
  "description": "Write API docs",
  "status": "completed",
  "createdAt": 1706435232000,
  "updatedAt": 1706435500000
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

#### 5. Delete Task
**DELETE** `/tasks/:id`

Permanently deletes a task.

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response (204 No Content):**
No body returned.

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

### Complete Testing Workflow

```bash
# Start the server
npm run dev

# 1. List all tasks (should be empty or have samples)
curl http://localhost:3000/tasks | jq .

# 2. Create first task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Motia Framework",
    "description": "Complete all three tutorials",
    "status": "in-progress"
  }' | jq .

# Save the task ID from response (e.g., "1")

# 3. Create second task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Production API",
    "description": "Deploy to production",
    "status": "pending"
  }' | jq .

# 4. List all tasks (should show 2)
curl http://localhost:3000/tasks | jq .

# 5. Get specific task
curl http://localhost:3000/tasks/1 | jq .

# 6. Update task status
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | jq .

# 7. Verify update
curl http://localhost:3000/tasks/1 | jq '.status'
# Should output: "completed"

# 8. Delete task
curl -X DELETE http://localhost:3000/tasks/2 -w "\nHTTP Status: %{http_code}\n"
# Should output: HTTP Status: 204

# 9. Verify deletion
curl http://localhost:3000/tasks | jq 'length'
# Should output: 1

# 10. Try to get deleted task (should fail)
curl http://localhost:3000/tasks/2 | jq .
# Should output: {"error": "Task not found"}
```

### Data Storage

All tasks are stored in `.data/tasks.json`:

```json
{
  "seq": 3,
  "tasks": {
    "1": {
      "id": "1",
      "title": "Learn Motia Framework",
      "description": "Complete all three tutorials",
      "status": "completed",
      "createdAt": 1706435232000,
      "updatedAt": 1706435500000
    }
  }
}
```

---

## 2. Event-Driven User Registration

**Duration:** 30 minutes | **Difficulty:** 🟡 Intermediate

### Overview

Build an event-driven system where user registration triggers multiple parallel workflows: sending welcome emails, setting up accounts, and logging notifications.

### What You'll Build

- ✅ Event-driven architecture with fan-out pattern
- ✅ Parallel async processing
- ✅ Event chaining (events triggering other events)
- ✅ Redis state management
- ✅ Status tracking API

### Event Flow

```
POST /users/register
    ↓ (Immediately returns 201)
    ↓ (Emits: user.registered)
    ↓
    ├──────────────┬────────────────┐
    ↓              ↓                ↓
SendEmail     SetupAccount    (parallel processing)
    ↓
    ↓ (Emits: email.sent)
    ↓
LogNotification
```

### API Reference

#### 1. Register User
**POST** `/users/register`

Registers a new user and triggers parallel workflows.

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

**Response (201 Created):**
```json
{
  "userId": "user-1706435232000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "status": "pending",
  "createdAt": "2024-01-28T10:30:00.000Z"
}
```

**Note:** Response returns immediately. Background processes run asynchronously.

---

#### 2. Get User Status
**GET** `/users/:userId/status`

Checks registration status and workflow completion.

**cURL Example:**
```bash
curl http://localhost:3000/users/user-1706435232000/status
```

**Response (200 OK) - Pending:**
```json
{
  "userId": "user-1706435232000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "status": "pending",
  "createdAt": "2024-01-28T10:30:00.000Z",
  "emailSent": false,
  "accountSetup": false
}
```

**Response (200 OK) - Completed:**
```json
{
  "userId": "user-1706435232000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "status": "active",
  "createdAt": "2024-01-28T10:30:00.000Z",
  "emailSent": true,
  "accountSetup": true
}
```

**Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

---

### Complete Testing Workflow

```bash
# Start the server
npm run dev

# 1. Register a new user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "password": "password123"
  }' | jq .

# Save the userId from response

# 2. Immediately check status (should be "pending")
curl http://localhost:3000/users/user-1706435232000/status | jq .

# Output should show:
# {
#   "status": "pending",
#   "emailSent": false,
#   "accountSetup": false
# }

# 3. Wait 2-3 seconds for background processing

# 4. Check status again (should be "active")
curl http://localhost:3000/users/user-1706435232000/status | jq .

# Output should show:
# {
#   "status": "active",
#   "emailSent": true,
#   "accountSetup": true
# }

# 5. Register multiple users and see parallel processing
for i in {1..3}; do
  curl -X POST http://localhost:3000/users/register \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User $i\",
      \"email\": \"user$i@example.com\",
      \"password\": \"password$i\"
    }" &
done

# Wait for all to complete
wait

# 6. Check server logs to see parallel event processing
# You'll see:
# [INFO] RegisterUser - Registering new user
# [INFO] SendWelcomeEmail - Sending welcome email
# [INFO] SetupUserAccount - Setting up user account
# [INFO] LogNotification - Logging notification
```

### Understanding Events

**Event Emission:**
```typescript
// In RegisterUser API
await emit({
  topic: 'user.registered',
  data: { userId, name, email }
})
```

**Event Subscription:**
```typescript
// In SendWelcomeEmail Event Handler
export const config = {
  type: 'event',
  subscribes: ['user.registered'],
  // ...
}

export const handler = async (input, { emit, logger }) => {
  const { userId, name, email } = input
  // Process event...
  
  // Emit another event
  await emit({
    topic: 'email.sent',
    data: { userId, email, type: 'welcome' }
  })
}
```

---

## 3. AI Research Agent System

**Duration:** 45 minutes | **Difficulty:** 🔴 Advanced

### Overview

Build a sophisticated multi-agent AI system that orchestrates research using Google's Gemini API. Agents work sequentially: Planning → Research → Analysis → Synthesis → Report.

### What You'll Build

- ✅ Sequential multi-agent pipeline
- ✅ Google Gemini AI integration
- ✅ Retry logic with exponential backoff
- ✅ API rate limit handling
- ✅ Daily quota management
- ✅ Complex state management

### Prerequisites

- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Patience (takes 30-60 seconds per research)

### Setup

```bash
# 1. Create project
npx motia@latest create ai-research-agent
cd ai-research-agent

# 2. Install Gemini SDK
npm install @google/generative-ai

# 3. Configure API key
echo "GOOGLE_API_KEY=your_api_key_here" >> .env

# 4. Copy implementation files (see below)

# 5. Start server
npm run dev
```

### API Reference

#### 1. Start Research
**POST** `/research`

Initiates AI research workflow with 5 sequential agents.

**Request Body:**
```json
{
  "query": "What are the benefits and challenges of microservices architecture?",
  "depth": "standard"
}
```

**Depth Options:**
- `"quick"`: 6 API calls (~20 seconds)
- `"standard"`: 8 API calls (~40 seconds)
- `"deep"`: 10 API calls (~60 seconds)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the benefits and challenges of microservices architecture?",
    "depth": "standard"
  }'
```

**Response (201 Created):**
```json
{
  "researchId": "research-1706435232000",
  "query": "What are the benefits and challenges of microservices architecture?",
  "depth": "standard",
  "status": "pending",
  "progress": {
    "planning": "pending",
    "research": "pending",
    "analysis": "pending",
    "synthesis": "pending"
  }
}
```

**Note:** API responds immediately. AI processing happens in background (30-60s).

---

#### 2. Get Research Status
**GET** `/research/:researchId/status`

Checks research progress and retrieves final report.

**cURL Example:**
```bash
curl http://localhost:3000/research/research-1706435232000/status
```

**Response (200 OK) - In Progress:**
```json
{
  "researchId": "research-1706435232000",
  "query": "What are the benefits and challenges of microservices architecture?",
  "status": "pending",
  "progress": {
    "planning": "completed",
    "research": "completed",
    "analysis": "in-progress",
    "synthesis": "pending"
  }
}
```

**Response (200 OK) - Completed:**
```json
{
  "researchId": "research-1706435232000",
  "query": "What are the benefits and challenges of microservices architecture?",
  "status": "completed",
  "progress": {
    "planning": "completed",
    "research": "completed",
    "analysis": "completed",
    "synthesis": "completed"
  },
  "report": {
    "title": "Research Report: Microservices Architecture",
    "executive_summary": "Microservices architecture offers significant benefits including scalability, independent deployment, and technology flexibility. However, it introduces challenges such as increased complexity, distributed system concerns, and operational overhead...",
    "key_takeaways": [
      "Microservices enable independent scaling of services",
      "Each service can use different technology stacks",
      "Deployment complexity increases with service count",
      "Requires robust monitoring and logging infrastructure",
      "Network latency can impact performance"
    ],
    "conclusions": "While microservices offer powerful architectural advantages, teams should carefully evaluate whether their system complexity warrants the operational overhead. Start with a monolith and decompose strategically.",
    "next_steps": [
      "Implement API gateway for unified entry point",
      "Set up distributed tracing and monitoring",
      "Define service boundaries using domain-driven design"
    ],
    "confidence_level": "high",
    "generated_at": "2024-01-28T10:35:00.000Z"
  }
}
```

---

### Complete Testing Workflow

```bash
# Start the server
npm run dev

# 1. Start a research task
RESEARCH_ID=$(curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the key principles of clean code?",
    "depth": "quick"
  }' | jq -r '.researchId')

echo "Research ID: $RESEARCH_ID"

# 2. Check status immediately (should be pending)
curl http://localhost:3000/research/$RESEARCH_ID/status | jq '.progress'

# Output:
# {
#   "planning": "pending",
#   "research": "pending",
#   "analysis": "pending",
#   "synthesis": "pending"
# }

# 3. Wait 10 seconds and check again
sleep 10
curl http://localhost:3000/research/$RESEARCH_ID/status | jq '.progress'

# Output might show:
# {
#   "planning": "completed",
#   "research": "in-progress",
#   "analysis": "pending",
#   "synthesis": "pending"
# }

# 4. Wait another 20 seconds for completion
sleep 20
curl http://localhost:3000/research/$RESEARCH_ID/status | jq '.status, .report.title'

# Output:
# "completed"
# "Research Report: Key Principles of Clean Code"

# 5. Get the full report
curl http://localhost:3000/research/$RESEARCH_ID/status | \
  jq '.report' > report.json

cat report.json | jq '.key_takeaways'

# Output:
# [
#   "Use meaningful and descriptive variable names",
#   "Functions should do one thing and do it well",
#   "Keep functions small and focused",
#   "Write self-documenting code with clear intent",
#   "Follow consistent code formatting standards"
# ]

# 6. Test error handling (quota exceeded)
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "This will fail if quota exceeded",
    "depth": "standard"
  }' | jq .

# If you've exceeded your free tier (20 requests/day):
# Output:
# {
#   "status": "failed",
#   "error": "API quota exceeded. You've reached the daily limit...",
#   "errorDetails": {
#     "suggestion": "Wait until midnight Pacific Time or use depth: 'quick'"
#   }
# }
```

### API Call Breakdown

For each research request:

| Agent | API Calls | Duration |
|-------|-----------|----------|
| Planning Agent | 1 | ~5s |
| Research Agent | 5 (one per topic) | ~15s |
| Analysis Agent | 1 | ~5s |
| Synthesis Agent | 1 | ~5s |
| **Total** | **8** | **~30s** |

### Free Tier Limits

Google Gemini Free Tier:
- **Per-minute:** 5 requests
- **Per-day:** 20 requests

**Recommendations:**
- Use `depth: "quick"` for testing (6 API calls)
- Run max 2-3 research tasks per day on free tier
- Upgrade to paid tier for production

---

## 🎓 Key Learnings Summary

### Project 1: REST API Basics
✓ HTTP methods (GET, POST, PUT, DELETE)  
✓ Request/response schemas with Zod  
✓ File-based persistence  
✓ Error handling (404, validation errors)  
✓ Path parameters and request bodies  

### Project 2: Event-Driven Architecture
✓ Event emission and subscription  
✓ Asynchronous processing  
✓ Parallel event handlers (fan-out)  
✓ Event chaining (sequential events)  
✓ Redis state management  

### Project 3: Multi-Agent AI Systems
✓ Sequential agent pipelines  
✓ External API integration  
✓ Retry logic with exponential backoff  
✓ Rate limit handling  
✓ Complex state orchestration  
✓ Error recovery strategies  

---

## 🚀 Next Steps

### Add Database Integration

Replace file/Redis storage with PostgreSQL:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Instead of taskStore.list()
const tasks = await prisma.task.findMany()
```

### Add Authentication

```typescript
import { authMiddleware } from './middleware/auth'

export const config: ApiRouteConfig = {
  // ...
  middleware: [authMiddleware]
}
```

### Deploy to Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📚 Resources

- [Motia Documentation](https://motia.dev/docs)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Zod Schema Validation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy Building! 🎉**

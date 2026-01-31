# Motia Framework - Complete Tutorial Repository

**Three progressive projects**: From simple REST APIs to advanced AI multi-agent systems.

## 🎯 Quick Start

Choose your learning path based on your experience level:

| Project | Difficulty | Time | Description |
|---------|------------|------|-------------|
| **[1. Task Management API](#1-task-management-rest-api)** | 🟢 Beginner | 20 min | Learn REST APIs, CRUD operations, and file storage |
| **[2. User Registration Workflow](#2-event-driven-user-registration)** | 🟡 Intermediate | 30 min | Master event-driven architecture and async processing |
| **[3. AI Research Agent](#3-ai-research-agent-system)** | 🔴 Advanced | 45 min | Build multi-agent AI systems with Google Gemini |

## 📖 Complete Tutorial Guide

**👉 See [TUTORIAL.md](./TUTORIAL.md) for the complete step-by-step guide with:**
- Architecture comparisons and flow diagrams
- Complete code implementations  
- API documentation with cURL examples
- Testing workflows
- Troubleshooting tips

## 🏗️ Repository Structure

```
Motia/
├── my-app/                      # Project 1: Task Management REST API
│   ├── src/tasks/
│   │   ├── task-store.ts       # File-based data store
│   │   ├── create-task.step.ts # POST /tasks
│   │   ├── get-tasks.step.ts   # GET /tasks
│   │   ├── get-task-by-id.step.ts
│   │   ├── update-task.step.ts
│   │   └── delete-task.step.ts
│   └── .data/tasks.json         # Task storage
│
├── event-driven-workflow/       # Project 2: User Registration
│   └── src/users/
│       ├── register-user.step.ts
│       ├── send-welcome-email.step.ts
│       ├── setup-account.step.ts
│       ├── log-notification.step.ts
│       └── get-user-status.step.ts
│
├── ai/                          # Project 3: AI Research Agent
│   ├── src/research/
│   │   ├── research-api.step.ts
│   │   ├── planning-agent.step.ts
│   │   ├── research-agent.step.ts
│   │   ├── analysis-agent.step.ts
│   │   ├── synthesis-agent.step.ts
│   │   ├── report-logger.step.ts
│   │   └── status-api.step.ts
│   └── src/utils/
│       └── retry-helper.ts
│
├── TUTORIAL.md                  # 📚 Complete tutorial guide
├── README.md                    # This file
└── PRESENTATION.md              # Presentation guide
```

## 🚀 Quick Setup

### Project 1: Task Management API

```bash
cd my-app
npm install
npm run dev

# Test the API
curl http://localhost:3000/tasks
```

**Key APIs:**
- `POST /tasks` - Create task
- `GET /tasks` - List tasks  
- `GET /tasks/:id` - Get task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Project 2: User Registration

```bash
cd event-driven-workflow
npm install
npm run dev

# Register a user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass123"}'
```

**Key APIs:**
- `POST /users/register` - Register user (triggers events)
- `GET /users/:id/status` - Check registration status

### Project 3: AI Research Agent

```bash
cd ai
npm install @google/generative-ai

# Add your API key
echo "GOOGLE_API_KEY=your_key_here" >> .env

npm run dev

# Start research
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{"query":"What is clean code?","depth":"quick"}'
```

**Key APIs:**
- `POST /research` - Start AI research
- `GET /research/:id/status` - Check progress & get report

## 📊 Architecture Comparison

### Execution Patterns

```
PROJECT 1: Synchronous REST
Client → API Handler → File DB → Response

PROJECT 2: Parallel Event Processing  
Client → API → Emit Event → [Handler 1, Handler 2, Handler 3]

PROJECT 3: Sequential AI Pipeline
Client → API → Agent 1 → Agent 2 → Agent 3 → Agent 4 → Complete
```

### Feature Matrix

| Feature | Project 1 | Project 2 | Project 3 |
|---------|-----------|-----------|-----------|
| **Pattern** | REST CRUD | Event-Driven | Multi-Agent |
| **Execution** | Sync | Async (Parallel) | Async (Sequential) |
| **Storage** | File JSON | Redis | Redis |
| **Endpoints** | 5 | 2 | 2 |
| **Event Handlers** | 0 | 3 | 5 |
| **External APIs** | None | None | Gemini AI |
| **Response Time** | < 10ms | < 10ms + async | < 10ms + 30-60s |

## 1. Task Management REST API

**Duration:** 20 minutes | **Difficulty:** 🟢 Beginner

Build a complete CRUD API with file-based storage.

### What You'll Learn
- REST API design patterns
- Request validation with Zod
- File-based persistence
- HTTP status codes
- Error handling

### API Endpoints

```bash
# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Description","status":"pending"}'

# List all tasks
curl http://localhost:3000/tasks

# Get specific task
curl http://localhost:3000/tasks/1

# Update task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete task
curl -X DELETE http://localhost:3000/tasks/1
```

**See [TUTORIAL.md](./TUTORIAL.md#1-task-management-rest-api) for complete implementation.**

## 2. Event-Driven User Registration

**Duration:** 30 minutes | **Difficulty:** 🟡 Intermediate

Build an event-driven system with parallel async processing.

### What You'll Learn
- Event emission and subscription
- Asynchronous workflows
- Parallel event handlers (fan-out pattern)
- Event chaining
- State management with Redis

### Event Flow

```
POST /users/register
    ↓ (emits: user.registered)
    ├─→ Send Welcome Email → (emits: email.sent) → Log Notification
    └─→ Setup User Account
```

### API Endpoints

```bash
# Register user (triggers 3 parallel workflows)
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# Check status (wait 2-3 seconds after registration)
curl http://localhost:3000/users/user-1706435232000/status
```

**See [TUTORIAL.md](./TUTORIAL.md#2-event-driven-user-registration) for complete implementation.**

## 3. AI Research Agent System

**Duration:** 45 minutes | **Difficulty:** 🔴 Advanced

Build a multi-agent AI system using Google Gemini API.

### What You'll Learn
- Sequential agent pipelines
- External API integration (Google Gemini)
- Retry logic with exponential backoff
- Rate limit handling
- Complex state orchestration
- Error recovery strategies

### Agent Pipeline

```
Client Request
    ↓
Planning Agent → Research Agent → Analysis Agent → Synthesis Agent
    ↓                ↓                  ↓                ↓
Create Plan    Research 5 Topics    Analyze Results   Generate Report
```

### API Endpoints

```bash
# Start research (returns immediately, processing takes 30-60s)
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the benefits of microservices architecture?",
    "depth": "standard"
  }'

# Check progress and get report
curl http://localhost:3000/research/research-1706435232000/status
```

### Setup Requirements

```bash
# Get API key from https://aistudio.google.com/app/apikey
echo "GOOGLE_API_KEY=your_key_here" >> ai/.env

# Install Gemini SDK
cd ai && npm install @google/generative-ai
```

**See [TUTORIAL.md](./TUTORIAL.md#3-ai-research-agent-system) for complete implementation.**

---

## 🎓 Key Concepts by Project

### Project 1: REST Fundamentals
✓ HTTP methods (GET, POST, PUT, DELETE)  
✓ Request/response validation with Zod  
✓ File-based data persistence  
✓ Error handling and status codes  
✓ Path parameters and bodies  

### Project 2: Event-Driven Architecture
✓ Event emission (`emit`)  
✓ Event subscription (`subscribes`)  
✓ Parallel processing (fan-out)  
✓ Event chaining (sequential events)  
✓ Async workflows  
✓ Redis state management  

### Project 3: Multi-Agent Systems
✓ Sequential pipelines  
✓ External API integration  
✓ Retry mechanisms  
✓ Rate limit handling  
✓ Complex orchestration  
✓ Error recovery  

---

## 📚 Additional Resources

- **[TUTORIAL.md](./TUTORIAL.md)** - Complete step-by-step guide with code and examples
- **[PRESENTATION.md](./PRESENTATION.md)** - 45-60 minute presentation guide
- [Motia Documentation](https://motia.dev/docs)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Zod Validation](https://zod.dev)

---

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve these tutorials!

---

## 📄 License

MIT License - feel free to use these tutorials for learning and teaching.

---

**Happy Building with Motia! 🎉**

---

# Project 1: Task Management REST API

**Duration:** 20 minutes | **Difficulty:** Beginner | **Pattern:** REST CRUD

## Overview

A complete REST API with full CRUD operations for managing tasks. This project teaches the fundamentals of building HTTP APIs with Motia, including request validation, error handling, and data persistence.

### What You'll Learn

- ✅ Create REST API endpoints (GET, POST, PUT, DELETE)
- ✅ Use Zod for request/response validation
- ✅ Implement file-based data persistence
- ✅ Handle path parameters and request bodies
- ✅ Return proper HTTP status codes
- ✅ Test APIs with cURL and Workbench

### Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────────────────────────────┐
│     Motia API Endpoints             │
│                                     │
│  POST /tasks    → Create Task       │
│  GET /tasks     → List All Tasks    │
│  GET /tasks/:id → Get Task by ID    │
│  PUT /tasks/:id → Update Task       │
│  DELETE /tasks/:id → Delete Task    │
└──────────┬──────────────────────────┘
           │
           ↓
    ┌──────────────┐
    │  Task Store  │
    │  (File JSON) │
    └──────────────┘
```

### Tech Stack

- **Framework:** Motia v0.17.14-beta.196
- **Language:** TypeScript
- **Validation:** Zod v4.3.6
- **Storage:** File-based JSON (.data/tasks.json)
- **Runtime:** Node.js v24+

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Project Structure](#project-structure)
4. [Implementation Steps](#implementation-steps)
5. [API Endpoints](#api-endpoints)
6. [Testing the API](#testing-the-api)
7. [Workbench Visualization](#workbench-visualization)
8. [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Redis** (optional - Motia can use in-memory Redis)

## Installation & Setup

### Step 1: Create a New Motia Project

Create a new Motia project using the CLI:

```bash
# Create a new project
npx motia@latest create my-app

# Navigate to your project
cd my-app
```

During installation, you'll be prompted to:
- Choose a template (select **Starter** for a clean project)
- Choose a language (select **TypeScript**)
- Configure Redis (you can skip it for development with `--skip-redis`)

### Step 2: Start the Development Server

Start the Motia development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000` with the Workbench UI automatically available.

## Project Structure

After creating the project, your structure will look like this:

```
my-app/
├── src/
│   ├── hello/              # Example hello world API (delete this)
│   └── tasks/              # Task Management API (we'll create this)
│       ├── task-store.ts         # File-based data store
│       ├── create-task.step.ts   # POST /tasks
│       ├── get-tasks.step.ts     # GET /tasks
│       ├── get-task-by-id.step.ts # GET /tasks/:id
│       ├── update-task.step.ts   # PUT /tasks/:id
│       └── delete-task.step.ts   # DELETE /tasks/:id
├── .data/
│   └── tasks.json          # Task data storage (auto-created)
├── motia.config.ts         # Motia configuration
├── package.json
├── tsconfig.json
└── .env
```

## Implementation Steps

### Step 1: Create the Tasks Directory

Create a new directory for your task-related API steps:

```bash
mkdir -p src/tasks
```

### Step 2: Create the Data Store

Create `src/tasks/task-store.ts` - a file-based store for managing tasks:

```typescript
// src/tasks/task-store.ts
// Simple file-based store for tasks
import fs from 'node:fs'
import path from 'node:path'

export type Task = {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: number
  updatedAt: number
}

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE = path.join(DATA_DIR, 'tasks.json')

type DbShape = { seq: number; tasks: Record<string, Task> }

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(FILE)) {
    const init: DbShape = { seq: 1, tasks: {} }
    fs.writeFileSync(FILE, JSON.stringify(init))
  }
}

function load(): DbShape {
  ensureFile()
  return JSON.parse(fs.readFileSync(FILE, 'utf8')) as DbShape
}

function save(db: DbShape): void {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2))
}

const now = () => Date.now()

export const taskStore = {
  create(input: {
    title: string
    description: string
    status?: Task['status']
  }): Task {
    const db = load()
    const id = String(db.seq++)
    const task: Task = {
      id,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status ?? 'pending',
      createdAt: now(),
      updatedAt: now(),
    }
    db.tasks[id] = task
    save(db)
    return task
  },

  list(): Task[] {
    const db = load()
    return Object.values(db.tasks).sort((a, b) => b.updatedAt - a.updatedAt)
  },

  get(id: string): Task | null {
    const db = load()
    return db.tasks[id] ?? null
  },

  update(
    id: string,
    patch: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Task | null {
    const db = load()
    const cur = db.tasks[id]
    if (!cur) return null
    const next: Task = {
      ...cur,
      ...patch,
      title: typeof patch.title === 'string' ? patch.title.trim() : cur.title,
      description:
        typeof patch.description === 'string'
          ? patch.description.trim()
          : cur.description,
      updatedAt: now(),
    }
    db.tasks[id] = next
    save(db)
    return next
  },

  remove(id: string): boolean {
    const db = load()
    if (!db.tasks[id]) return false
    delete db.tasks[id]
    save(db)
    return true
  },
}
```

**Key Features:**
- ✅ File-based storage in `.data/tasks.json`
- ✅ Auto-incrementing IDs
- ✅ CRUD operations (Create, Read, Update, Delete, List)
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Sorted by most recently updated

### Step 3: Create POST /tasks Endpoint (Create Task)

Create `src/tasks/create-task.step.ts`:

```typescript
// src/tasks/create-task.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { taskStore } from './task-store'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'CreateTask',
  description: 'Create a new task',
  method: 'POST',
  path: '/tasks',
  flows: ['task-management'],
  emits: [],
  
  bodySchema: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string(),
    status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  }),

  responseSchema: {
    201: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['pending', 'in-progress', 'completed']),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  },
}

export const handler: Handlers['CreateTask'] = async (req, { logger }) => {
  logger.info('Creating new task', { body: req.body })

  const newTask = taskStore.create(req.body)

  logger.info('Task created successfully', { taskId: newTask.id })

  return {
    status: 201,
    body: newTask,
  }
}
```

### Step 4: Create GET /tasks Endpoint (List All Tasks)

Create `src/tasks/get-tasks.step.ts`:

```typescript
// src/tasks/get-tasks.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { taskStore } from './task-store'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'GetTasks',
  description: 'Get all tasks',
  method: 'GET',
  path: '/tasks',
  flows: ['task-management'],
  emits: [],
  
  responseSchema: {
    200: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['pending', 'in-progress', 'completed']),
      createdAt: z.string(),
      updatedAt: z.string(),
    })),
  },
}

export const handler: Handlers['GetTasks'] = async (req, { logger }) => {
  logger.info('Retrieving all tasks')

  const tasks = taskStore.list()

  logger.info('Tasks retrieved successfully', { count: tasks.length })

  return {
    status: 200,
    body: tasks,
  }
}
```

### Step 5: Create GET /tasks/:id Endpoint (Get Task by ID)

Create `src/tasks/get-task-by-id.step.ts`:

```typescript
// src/tasks/get-task-by-id.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { taskStore } from './task-store'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'GetTaskById',
  description: 'Get a specific task by ID',
  method: 'GET',
  path: '/tasks/:id',
  flows: ['task-management'],
  emits: [],
  
  responseSchema: {
    200: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['pending', 'in-progress', 'completed']),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['GetTaskById'] = async (req, { logger }) => {
  const taskId = req.pathParams.id
  logger.info('Retrieving task by ID', { taskId })

  const task = taskStore.get(taskId)

  if (!task) {
    logger.warn('Task not found', { taskId })
    return {
      status: 404,
      body: { error: 'Task not found' },
    }
  }

  logger.info('Task retrieved successfully', { taskId })

  return {
    status: 200,
    body: task,
  }
}
```

### Step 6: Create PUT /tasks/:id Endpoint (Update Task)

Create `src/tasks/update-task.step.ts`:

```typescript
// src/tasks/update-task.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { taskStore } from './task-store'

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
})

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'UpdateTask',
  description: 'Update a task by ID',
  method: 'PUT',
  path: '/tasks/:id',
  flows: ['task-management'],
  emits: [],
  
  bodySchema: updateTaskSchema,

  responseSchema: {
    200: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['pending', 'in-progress', 'completed']),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['UpdateTask'] = async (req, { logger }) => {
  const taskId = req.pathParams.id
  logger.info('Updating task', { taskId, body: req.body })

  const updates = updateTaskSchema.parse(req.body)
  const task = taskStore.update(taskId, updates)

  if (!task) {
    logger.warn('Task not found', { taskId })
    return {
      status: 404,
      body: { error: 'Task not found' },
    }
  }

  logger.info('Task updated successfully', { taskId })

  return {
    status: 200,
    body: task,
  }
}
```

### Step 7: Create DELETE /tasks/:id Endpoint (Delete Task)

Create `src/tasks/delete-task.step.ts`:

```typescript
// src/tasks/delete-task.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { taskStore } from './task-store'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'DeleteTask',
  description: 'Delete a task by ID',
  method: 'DELETE',
  path: '/tasks/:id',
  flows: ['task-management'],
  emits: [],
  
  responseSchema: {
    404: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['DeleteTask'] = async (req, { logger }) => {
  const taskId = req.pathParams.id
  logger.info('Deleting task', { taskId })

  const deleted = taskStore.remove(taskId)

  if (!deleted) {
    logger.warn('Task not found', { taskId })
    return {
      status: 404,
      body: { error: 'Task not found' },
    }
  }

  logger.info('Task deleted successfully', { taskId })

  return {
    status: 204,
  }
}
```

### Step 8: Start the Development Server

The Motia development server uses hot module replacement, so if it's already running, it will automatically pick up your new endpoints. If not, start it:

```bash
npm run dev
```

You should see output like:

```
➜ [REGISTERED] Step (API) src/tasks/create-task.step.ts registered
➜ [REGISTERED] Step (API) src/tasks/get-tasks.step.ts registered
➜ [REGISTERED] Step (API) src/tasks/get-task-by-id.step.ts registered
➜ [REGISTERED] Step (API) src/tasks/update-task.step.ts registered
➜ [REGISTERED] Step (API) src/tasks/delete-task.step.ts registered
🚀 Server ready and listening on port 3000
🔗 Open http://localhost:3000 to open workbench 🛠️
```

## API Endpoints

Your Task Management API now has 5 REST endpoints:

### 1. Create Task
**POST** `/tasks`

Creates a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "id": "1706435232000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "createdAt": "2024-01-28T10:30:00.000Z",
  "updatedAt": "2024-01-28T10:30:00.000Z"
}
```

### 2. Get All Tasks
**GET** `/tasks`

Retrieves a list of all tasks.

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "title": "Learn Motia Framework",
    "description": "Get familiar with Motia API endpoints",
    "status": "in-progress",
    "createdAt": "2024-01-28T10:00:00.000Z",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Build REST API",
    "description": "Create CRUD endpoints for tasks",
    "status": "pending",
    "createdAt": "2024-01-28T10:00:00.000Z",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  }
]
```

### 3. Get Task by ID
**GET** `/tasks/:id`

Retrieves a specific task by its ID.

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Learn Motia Framework",
  "description": "Get familiar with Motia API endpoints",
  "status": "in-progress",
  "createdAt": "2024-01-28T10:00:00.000Z",
  "updatedAt": "2024-01-28T10:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

### 4. Update Task
**PUT** `/tasks/:id`

Updates an existing task. All fields are optional.

**Request Body:**
```json
{
  "title": "Learn Motia Framework - Updated",
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Learn Motia Framework - Updated",
  "description": "Get familiar with Motia API endpoints",
  "status": "completed",
  "createdAt": "2024-01-28T10:00:00.000Z",
  "updatedAt": "2024-01-28T10:35:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

### 5. Delete Task
**DELETE** `/tasks/:id`

Deletes a task by its ID.

**Response (204 No Content):**
No body returned on success.

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

## Testing the API

### Option 1: Using cURL

Test your API endpoints using curl commands:

```bash
# 1. Get all tasks
curl http://localhost:3000/tasks | jq .

# 2. Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Task",
    "description": "Testing CRUD operations",
    "status": "pending"
  }' | jq .

# 3. Get a specific task (replace '1' with actual task ID)
curl http://localhost:3000/tasks/1 | jq .

# 4. Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | jq .

# 5. Delete a task
curl -X DELETE http://localhost:3000/tasks/2 -w "\nHTTP Status: %{http_code}\n"

# 6. Verify the task was deleted
curl http://localhost:3000/tasks | jq .
```

### Option 2: Using Motia Workbench (Recommended)

The Motia Workbench provides a visual interface to test your APIs:

1. Open http://localhost:3000 in your browser
2. Click on **"Endpoints"** in the top navigation
3. You'll see all 5 task endpoints listed:
   - POST /tasks
   - GET /tasks
   - GET /tasks/:id
   - PUT /tasks/:id
   - DELETE /tasks/:id
4. Click on any endpoint to:
   - View full API documentation
   - See request/response schemas
   - Test the endpoint with a built-in form
   - View response data in real-time

## Workbench Visualization

### Viewing the Task Management Flow

The `flows` property in each endpoint configuration groups them into a visual workflow in the Workbench:

1. **Open the Workbench**: Navigate to http://localhost:3000
2. **Select the Flow**: In the top-left dropdown (where it shows "hello-world-flow"), select **"task-management"**
3. **View the Diagram**: You'll see all 5 task API endpoints visualized as a workflow diagram

### Understanding the Flow Configuration

The `flows: ['task-management']` property in each step configuration tells Motia to group these endpoints together. This creates:

- **Visual Organization**: See all related endpoints in one diagram
- **Better Navigation**: Quickly switch between different workflow groups
- **Documentation**: Understand how different parts of your API relate to each other

### Key Features in Workbench

- **📊 Flow Diagrams**: Visual representation of your API endpoints and their relationships
- **🔗 Endpoints Tab**: List and test all API endpoints interactively
- **📝 Logs Tab**: Real-time logging output from your API handlers
- **📈 States Tab**: Monitor application state and data flow
- **🔍 Tracing Tab**: Debug and trace request execution

## Files Structure

Your final project structure should look like this:

```
my-app/
├── src/
│   ├── hello/                    # Example hello world API
│   │   ├── hello-api.step.ts
│   │   └── process-greeting.step.ts
│   └── tasks/                    # Task Management API
│       ├── task-store.ts         # In-memory data store
│       ├── create-task.step.ts   # POST /tasks
│       ├── get-tasks.step.ts     # GET /tasks
│       ├── get-task-by-id.step.ts # GET /tasks/:id
│       ├── update-task.step.ts   # PUT /tasks/:id
│       └── delete-task.step.ts   # DELETE /tasks/:id
├── motia.config.ts               # Motia configuration with plugins
├── package.json
├── tsconfig.json
└── .env
```

## Key Concepts Explained

### 1. API Steps
Each file in `src/tasks/` is an **API Step** - a self-contained endpoint definition with:
- **config**: Defines the route, method, schemas, and flow membership
- **handler**: Contains the business logic for processing requests

### 2. Configuration Properties
- **type**: `'api'` for REST endpoints
- **name**: Unique identifier for the step
- **description**: Human-readable description shown in Workbench
- **method**: HTTP method (GET, POST, PUT, DELETE)
- **path**: URL path pattern (supports parameters like `:id`)
- **flows**: Array of flow names to group related endpoints
- **emits**: Array of events this step can emit (for event-driven workflows)
- **bodySchema**: Zod schema for request validation
- **responseSchema**: Zod schemas for different response status codes

### 3. Handler Context
The handler receives:
- **req**: Request object with `body`, `pathParams`, `query`, etc.
- **context**: Includes `logger`, `emit`, and other utilities

### 4. Type Safety
Motia provides full TypeScript support:
- Request/response types are automatically inferred from Zod schemas
- Handler types are generated based on the step name
- IDE autocomplete works throughout

## Next Steps

### 1. Add Database Integration

Replace the in-memory store with a real database:

```typescript
// Example with Prisma
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// In your handler:
const tasks = await prisma.task.findMany()
const task = await prisma.task.findUnique({ where: { id: taskId } })
const newTask = await prisma.task.create({ data: req.body })
```

### 2. Add Authentication

Protect your endpoints with authentication middleware:

```typescript
import { authMiddleware } from './middleware/auth'

export const config: ApiRouteConfig = {
  // ... other config
  middleware: [authMiddleware]
}
```

### 3. Add Event-Driven Workflows

Emit events when tasks are created or updated:

```typescript
export const config: ApiRouteConfig = {
  // ... other config
  emits: ['task-created', 'task-updated']
}

export const handler: Handlers['CreateTask'] = async (req, { emit, logger }) => {
  const newTask = taskStore.create(req.body)
  
  await emit({
    topic: 'task-created',
    data: { taskId: newTask.id, task: newTask }
  })
  
  return { status: 201, body: newTask }
}
```

### 4. Add Pagination

Implement pagination for the list endpoint:

```typescript
// Add query parameters for pagination
const page = parseInt(req.query.page || '1')
const limit = parseInt(req.query.limit || '10')
const skip = (page - 1) * limit

const tasks = taskStore.list().slice(skip, skip + limit)
const total = taskStore.list().length

return {
  status: 200,
  body: {
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}
```

### 5. Add Filtering and Sorting

Allow filtering tasks by status:

```typescript
const status = req.query.status
const tasks = taskStore.list().filter(task => 
  !status || task.status === status
)
```

## Resources

- [Motia Documentation](https://motia.dev/docs)
- [Getting Started Guide](https://motia.dev/docs/getting-started/quick-start)
- [REST API Best Practices](https://motia.dev/docs/getting-started/build-your-first-app/creating-your-first-rest-api)
- [Zod Schema Validation](https://zod.dev)
- [API Step Reference](https://motia.dev/docs/concepts/steps)
- [Workbench Guide](https://motia.dev/docs/concepts/workbench)

## Troubleshooting

### Endpoints not appearing in Workbench
- Ensure the `flows` property is set in your step configuration
- Check that the `endpointPlugin` is included in `motia.config.ts`
- Restart the development server

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check that your `tsconfig.json` is properly configured
- Ensure you're importing types from 'motia' package

### Server won't start
- Check that port 3000 is not already in use
- Verify Redis is running (or use `--skip-redis` flag)
- Check the console for error messages

---

## Summary

You've successfully built a complete REST API with CRUD operations using Motia! You learned:

✅ How to set up a Motia project  
✅ How to create API endpoints using API Steps  
✅ How to implement full CRUD operations  
✅ How to use Zod for request/response validation  
✅ How to test APIs using cURL and Workbench  
✅ How to organize endpoints into flows for better visualization  
✅ How to use the Motia Workbench for development and testing  

This foundation can be extended with databases, authentication, event-driven workflows, and more complex business logic!

### 1. Create Task
**POST** `/tasks`

Creates a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "id": "1706435232000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "createdAt": "2024-01-28T10:30:00.000Z",
  "updatedAt": "2024-01-28T10:30:00.000Z"
}
```

---

### 2. Get All Tasks
**GET** `/tasks`

Retrieves a list of all tasks.

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "title": "Learn Motia Framework",
    "description": "Get familiar with Motia API endpoints",
    "status": "in-progress",
    "createdAt": "2024-01-28T10:00:00.000Z",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Build REST API",
    "description": "Create CRUD endpoints for tasks",
    "status": "pending",
    "createdAt": "2024-01-28T10:00:00.000Z",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  }
]
```

---

### 3. Get Task by ID
**GET** `/tasks/:id`

Retrieves a specific task by its ID.

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Learn Motia Framework",
  "description": "Get familiar with Motia API endpoints",
  "status": "in-progress",
  "createdAt": "2024-01-28T10:00:00.000Z",
  "updatedAt": "2024-01-28T10:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

### 4. Update Task
**PUT** `/tasks/:id`

Updates an existing task. All fields are optional.

**Request Body:**
```json
{
  "title": "Learn Motia Framework - Updated",
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Learn Motia Framework - Updated",
  "description": "Get familiar with Motia API endpoints",
  "status": "completed",
  "createdAt": "2024-01-28T10:00:00.000Z",
  "updatedAt": "2024-01-28T10:35:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

### 5. Delete Task
**DELETE** `/tasks/:id`

Deletes a task by its ID.

**Response (204 No Content):**
No body returned on success.

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

## Testing the API

### Using cURL

```bash
# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "Task description", "status": "pending"}'

# Get all tasks
curl http://localhost:3000/tasks

# Get a specific task
curl http://localhost:3000/tasks/1

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

### Using Motia Workbench

1. Start the development server: `npm run dev`
2. Open http://localhost:3000 in your browser
3. Navigate to the API section in the workbench
4. You'll see all 5 task endpoints listed
5. Click on any endpoint to test it interactively

---

## Implementation Details

### Files Structure

```
src/tasks/
├── task-store.ts           # In-memory data store
├── create-task.step.ts     # POST /tasks
├── get-tasks.step.ts       # GET /tasks
├── get-task-by-id.step.ts  # GET /tasks/:id
├── update-task.step.ts     # PUT /tasks/:id
└── delete-task.step.ts     # DELETE /tasks/:id
```

### Task Schema

```typescript
interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}
```

### Key Features

- ✅ Full CRUD operations
- ✅ Request validation using Zod schemas
- ✅ Type-safe handlers with Motia framework
- ✅ In-memory data store (easily replaceable with a database)
- ✅ Proper HTTP status codes
- ✅ Error handling for not found resources
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Logged operations for observability

---

## Next Steps

To connect this API to a real database:

1. Replace the in-memory `taskStore` with a database client (e.g., Prisma, MongoDB, PostgreSQL)
2. Update the handler functions to use database queries
3. Add authentication and authorization middleware
4. Implement pagination for the list endpoint
5. Add filtering and sorting capabilities

Example with Prisma:

```typescript
// Instead of: const tasks = taskStore.list()
const tasks = await prisma.task.findMany()

// Instead of: const task = taskStore.get(taskId)
const task = await prisma.task.findUnique({ where: { id: taskId } })
```

---

# AI Research Agent Workflow with Google Gemini

A comprehensive guide to building multi-agent AI systems using Motia's event-driven architecture. This tutorial demonstrates how to orchestrate multiple specialized AI agents that work together sequentially to complete complex research tasks using Google Gemini.

## What You'll Build

An AI-powered research system where multiple agents collaborate:
- 🎯 **Planning Agent** - Creates a structured research plan
- 🔍 **Research Agent** - Conducts research on each topic
- 📊 **Analysis Agent** - Analyzes all findings
- 📝 **Synthesis Agent** - Generates a comprehensive report

## Architecture Overview

### Sequential Agent Pipeline

```
POST /research
     ↓ (emits: research.started)
Planning Agent → Creates research plan
     ↓ (emits: plan.completed)
Research Agent → Conducts research (5 topics)
     ↓ (emits: research.completed)
Analysis Agent → Analyzes findings
     ↓ (emits: analysis.completed)
Synthesis Agent → Generates final report
     ↓ (emits: report.completed)
Report Logger → Logs completion
     ↓
GET /research/:id/status → Check status
```

### Key Concepts

**Event-Driven Architecture**: Each agent subscribes to the previous agent's completion event, creating a loosely coupled pipeline.

**State Management**: All intermediate results (plan, findings, analysis) are stored in Redis for retrieval and debugging.

**Retry Logic**: Built-in exponential backoff handles API rate limits automatically.

**Parallel Processing**: Multiple agents can subscribe to the same event for parallel execution (though this example is sequential).

## Table of Contents

1. [Prerequisites](#prerequisites-1)
2. [Installation & Setup](#installation--setup-1)
3. [Project Structure](#project-structure-1)
4. [Implementation Steps](#implementation-steps-1)
5. [Understanding Event Flow](#understanding-event-flow)
6. [Testing the Workflow](#testing-the-workflow-1)
7. [Troubleshooting](#troubleshooting-1)
8. [Next Steps](#next-steps-1)

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Redis** running locally (Motia can use in-memory Redis)
- **Google Gemini API key** ([Get one here](https://aistudio.google.com/app/apikey))

## Installation & Setup

### Step 1: Create a New Motia Project

```bash
# Create a new project
npx motia@latest create ai-research-agent --template starter-typescript

# Navigate to your project
cd ai-research-agent
```

### Step 2: Install Google Generative AI SDK

```bash
npm install @google/generative-ai
```

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Google Gemini API Key
GOOGLE_API_KEY=your_api_key_here

# Server Configuration
PORT=3000

# Redis Configuration (optional - uses in-memory if not specified)
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Get Your API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into `.env`

### Step 4: Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` with hot-reload enabled.

## Project Structure

```
ai-research-agent/
├── src/
│   └── research/                         # Research workflow
│       ├── research-api.step.ts          # API: Start research
│       ├── planning-agent.step.ts        # Agent: Create plan
│       ├── research-agent.step.ts        # Agent: Conduct research
│       ├── analysis-agent.step.ts        # Agent: Analyze findings
│       ├── synthesis-agent.step.ts       # Agent: Generate report
│       ├── report-logger.step.ts         # Event: Log completion
│       └── status-api.step.ts            # API: Check status
│   └── utils/
│       └── retry-helper.ts               # Retry logic for rate limits
├── motia.config.ts                       # Motia configuration
├── package.json
├── tsconfig.json
└── .env                                  # Environment variables
```

## Implementation Steps

### Step 1: Create the Retry Helper Utility

First, create a utility to handle API rate limits with exponential backoff.

**Create `src/utils/retry-helper.ts`:**

```typescript
/**
 * Retry helper with exponential backoff for API calls
 * Handles rate limiting and transient errors
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 5,
    initialDelay = 1000,
    maxDelay = 60000,
    backoffMultiplier = 2,
  } = options

  let lastError: Error | undefined
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Check if error is retryable (rate limit or server error)
      const isRateLimitError = error.message?.includes('429') || 
                               error.message?.includes('quota') ||
                               error.message?.includes('rate limit')
      const isServerError = error.message?.includes('500') || 
                           error.message?.includes('503')

      if (!isRateLimitError && !isServerError) {
        throw error // Non-retryable error
      }

      if (attempt === maxRetries) {
        throw new Error(
          `Max retries (${maxRetries}) reached. Last error: ${error.message}`
        )
      }

      // Extract retry delay from error if available
      const retryAfterMatch = error.message?.match(/retry in (\d+(?:\.\d+)?)/i)
      let waitTime = delay

      if (retryAfterMatch) {
        waitTime = Math.ceil(parseFloat(retryAfterMatch[1]) * 1000)
      }

      waitTime = Math.min(waitTime, maxDelay)

      console.log(
        `[RetryHelper] Attempt ${attempt + 1}/${maxRetries} failed. ` +
        `Retrying in ${waitTime}ms...`
      )

      await new Promise(resolve => setTimeout(resolve, waitTime))
      delay = Math.min(delay * backoffMultiplier, maxDelay)
    }
  }

  throw lastError || new Error('Retry failed with unknown error')
}
```

### Step 2: Create the Research API Endpoint

This endpoint receives research requests and starts the workflow.

**Create `src/research/research-api.step.ts`:**

```typescript
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ResearchAPI',
  description: 'Start a new AI research workflow',
  method: 'POST',
  path: '/research',
  flows: ['ai-research-agent'],
  emits: ['research.started'],
  
  bodySchema: z.object({
    query: z.string().min(10),
    depth: z.enum(['quick', 'standard', 'deep']).default('standard'),
  }),
  
  responseSchema: {
    201: z.object({
      researchId: z.string(),
      query: z.string(),
      depth: z.string(),
      status: z.string(),
      progress: z.object({
        planning: z.string(),
        research: z.string(),
        analysis: z.string(),
        synthesis: z.string(),
      }),
    }),
  },
}

export const handler: Handlers['ResearchAPI'] = async (req, { emit, logger, state }) => {
  const { query, depth } = req.body
  const researchId = `research-${Date.now()}`

  logger.info('[ResearchAPI] Starting research', { researchId, query, depth })

  // Initialize research state
  const initialState = {
    researchId,
    query,
    depth,
    status: 'pending',
    progress: {
      planning: 'pending',
      research: 'pending',
      analysis: 'pending',
      synthesis: 'pending',
    },
    createdAt: new Date().toISOString(),
  }

  await state.set('research', researchId, initialState)

  // Emit event to trigger planning agent
  await emit({
    topic: 'research.started',
    data: { researchId, query, depth },
  })

  logger.info('[ResearchAPI] Research workflow started', { researchId })

  return {
    status: 201,
    body: initialState,
  }
}
```

**Key Points:**
- `emits: ['research.started']` - Declares this step emits events
- `emit()` - Triggers the next agent in the pipeline
- `state.set()` - Stores research state in Redis
- Returns immediately while agents process asynchronously

### Step 3: Create the Planning Agent

The first agent that creates a research plan using Gemini.

**Create `src/research/planning-agent.step.ts`:**

```typescript
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a research planning AI agent. Create a comprehensive research plan for the following query:

"${query}"

Research depth: ${depth}

Provide a structured plan in JSON format:
{
  "research_topics": ["topic1", "topic2", "topic3"],
  "key_questions": ["question1", "question2", "question3"],
  "approach": "description of how research will be conducted",
  "estimated_time": 5
}

Respond ONLY with valid JSON, no markdown formatting.`

    const result = await retryWithBackoff(
      async () => await model.generateContent(prompt),
      { maxRetries: 5, initialDelay: 2000 }
    )
    
    const text = result.response.text()
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plan = JSON.parse(cleanText)

    logger.info('[PlanningAgent] Plan created', { 
      researchId, 
      topics: plan.research_topics.length 
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

    logger.info('[PlanningAgent] Plan emitted for research', { researchId })

  } catch (error: any) {
    logger.error('[PlanningAgent] Error creating plan', { 
      researchId, 
      error: error.message 
    })

    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      progress: {
        ...researchData.progress,
        planning: 'failed',
      },
      error: error.message,
    })
  }
}
```

**Key Points:**
- `type: 'event'` - Marks this as an event handler
- `subscribes: ['research.started']` - Listens for this event
- `retryWithBackoff()` - Handles API rate limits
- Updates state with results before emitting next event

### Step 4: Create the Research Agent

This agent conducts research on each topic from the plan.

**Create `src/research/research-agent.step.ts`:**

```typescript
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
    const findings: any[] = []

    // Research each topic sequentially
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

    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      progress: {
        ...researchData.progress,
        research: 'failed',
      },
      error: error.message,
    })
  }
}
```

**Key Points:**
- Loops through each research topic
- 2-second delay between API calls prevents rate limiting
- Each finding is stored in the findings array
- State is updated before emitting to next agent

### Step 5: Create the Analysis Agent

This agent analyzes all research findings.

**Create `src/research/analysis-agent.step.ts`:**

```typescript
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

    const findingsSummary = findings
      .map(f => `Topic: ${f.topic}\nSummary: ${f.summary}`)
      .join('\n\n')

    const prompt = `You are an analysis AI agent. Analyze the following research findings:

Original Query: "${query}"

Findings:
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
```

### Step 6: Create the Synthesis Agent

The final agent that generates a comprehensive report.

**Create `src/research/synthesis-agent.step.ts`:**

```typescript
import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { retryWithBackoff } from '../utils/retry-helper'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const config = {
  type: 'event',
  name: 'SynthesisAgent',
  description: 'AI agent that synthesizes final research report',
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

  logger.info('[SynthesisAgent] Synthesizing report', { researchId })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Type assertion for analysis
    const analysisData = analysis as {
      overall_assessment: string
      key_insights?: string[]
      patterns_identified?: string[]
      recommendations?: string[]
    }

    const context = `
Query: ${query}
Assessment: ${analysisData.overall_assessment}
Insights: ${analysisData.key_insights?.join(', ')}
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

    logger.info('[SynthesisAgent] Report generated', { researchId })

    // Update research state with final report
    const researchData = await state.get('research', researchId) as any
    await state.set('research', researchId, {
      ...researchData,
      report,
      status: 'completed',
      progress: {
        ...researchData.progress,
        synthesis: 'completed',
      },
      completedAt: new Date().toISOString(),
    })

    // Emit final completion event
    await emit({
      topic: 'report.completed',
      data: {
        researchId,
        report,
      },
    })

    logger.info('[SynthesisAgent] Report completed and emitted', { researchId })

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
```

### Step 7: Create the Report Logger

A simple event handler to log workflow completion.

**Create `src/research/report-logger.step.ts`:**

```typescript
import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config = {
  type: 'event',
  name: 'ReportLogger',
  description: 'Logs research report completion',
  flows: ['ai-research-agent'],
  subscribes: ['report.completed'],
  
  input: z.object({
    researchId: z.string(),
    report: z.any(),
  }),
} as const

export const handler: Handlers['ReportLogger'] = async (input, { logger }) => {
  const { researchId, report } = input

  logger.info('[ReportLogger] Research workflow completed!', { 
    researchId,
    title: report.title,
    confidence: report.confidence_level,
  })
}
```

### Step 8: Create the Status API Endpoint

An endpoint to check research progress and retrieve results.

**Create `src/research/status-api.step.ts`:**

```typescript
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ResearchStatusAPI',
  description: 'Get research workflow status',
  method: 'GET',
  path: '/research/:researchId/status',
  flows: ['ai-research-agent'],
  
  pathParamsSchema: z.object({
    researchId: z.string(),
  }),
  
  responseSchema: {
    200: z.object({
      researchId: z.string(),
      status: z.string(),
      progress: z.object({
        planning: z.string(),
        research: z.string(),
        analysis: z.string(),
        synthesis: z.string(),
      }),
      report: z.any().optional(),
      error: z.string().optional(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['ResearchStatusAPI'] = async (req, { logger, state }) => {
  const { researchId } = req.pathParams

  logger.info('[ResearchStatusAPI] Checking status', { researchId })

  const researchData = await state.get('research', researchId) as any

  if (!researchData) {
    return {
      status: 404,
      body: { error: 'Research not found' },
    }
  }

  return {
    status: 200,
    body: researchData,
  }
}
```

### Step 9: Verify Your Configuration

Ensure your `motia.config.ts` includes all necessary plugins:

```typescript
import { defineConfig } from '@motiadev/core'
import endpointPlugin from '@motiadev/plugin-endpoint/plugin'
import logsPlugin from '@motiadev/plugin-logs/plugin'
import observabilityPlugin from '@motiadev/plugin-observability/plugin'
import statesPlugin from '@motiadev/plugin-states/plugin'
import bullmqPlugin from '@motiadev/plugin-bullmq/plugin'

export default defineConfig({
  plugins: [
    observabilityPlugin,
    statesPlugin,
    endpointPlugin,
    logsPlugin,
    bullmqPlugin
  ],
})
```

## Understanding Event Flow

### Event Emission and Subscription

**Emitting Events:**
```typescript
await emit({
  topic: 'plan.completed',
  data: { researchId, query, plan }
})
```

**Subscribing to Events:**
```typescript
export const config = {
  type: 'event',
  subscribes: ['plan.completed'],
  // ...
}
```

### Sequential vs Parallel Processing

**Sequential (This Tutorial):**
- Each agent waits for previous completion
- Events create a chain: A → B → C → D

**Parallel (Alternative):**
- Multiple agents subscribe to same event
- All process simultaneously

```typescript
// Both agents trigger on same event
config1 = { subscribes: ['user.created'], ... }
config2 = { subscribes: ['user.created'], ... }
```

### State Management Pattern

```typescript
// Read state
const data = await state.get('namespace', 'key')

// Write state
await state.set('namespace', 'key', value)

// Update state
const current = await state.get('research', researchId)
await state.set('research', researchId, {
  ...current,
  newField: 'value'
})
```

## Testing the Workflow

### Step 1: Start a Research Task

```bash
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the benefits and challenges of microservices architecture?",
    "depth": "standard"
  }' | jq .
```

**Response:**
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

### Step 2: Monitor Progress (Wait 30-60 seconds)

```bash
# Replace with your actual researchId
curl http://localhost:3000/research/research-1706435232000/status | jq .
```

**Response (In Progress):**
```json
{
  "researchId": "research-1706435232000",
  "status": "pending",
  "progress": {
    "planning": "completed",
    "research": "completed",
    "analysis": "in-progress",
    "synthesis": "pending"
  }
}
```

**Response (Completed):**
```json
{
  "researchId": "research-1706435232000",
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
    "key_takeaways": [...],
    "conclusions": "...",
    "confidence_level": "high"
  }
}
```

### Step 3: Watch Real-Time Logs

In your terminal running `npm run dev`, you'll see:

```
[INFO] ResearchAPI - Starting research
[INFO] PlanningAgent - Creating research plan
[INFO] PlanningAgent - Plan created (5 topics)
[INFO] ResearchAgent - Starting research
[INFO] ResearchAgent - Researching topic: Benefits of Microservices
[INFO] ResearchAgent - Researching topic: Challenges of Microservices
[INFO] ResearchAgent - Research completed (5 findings)
[INFO] AnalysisAgent - Analyzing findings
[INFO] AnalysisAgent - Analysis completed
[INFO] SynthesisAgent - Synthesizing report
[INFO] SynthesisAgent - Report generated
[INFO] ReportLogger - Research workflow completed!
```

## Using the Motia Workbench

### Visual Workflow

1. Open http://localhost:3000 in your browser
2. Select **"ai-research-agent"** from the flow dropdown
3. View the complete workflow diagram:
   - Research API → Planning Agent → Research Agent → Analysis Agent → Synthesis Agent → Report Logger

### Interactive Testing

1. Click on **"Endpoints"** tab
2. Find **POST /research**
3. Click to open the test interface
4. Fill in the request body:
   ```json
   {
     "query": "Your research question here",
     "depth": "standard"
   }
   ```
5. Click **"Send Request"**
6. View response in real-time

### Monitoring Features

**Logs Tab:**
- Real-time log streaming
- Filter by agent name
- Search through logs

**States Tab:**
- View all stored research states
- Inspect intermediate results (plans, findings, analysis)
- Debug workflow issues

**Tracing Tab:**
- Trace complete request flow
- See timing for each agent
- Identify bottlenecks

## Troubleshooting

### API Rate Limits (429 Error)

**Problem:**
```
Error: [429 Too Many Requests] You exceeded your current quota
```

**Solution:**
The retry helper automatically handles this! It:
- Extracts retry delay from error message
- Waits the specified time
- Retries up to 5 times

You can also:
- Increase delays in `research-agent.step.ts` (currently 2s)
- Reduce number of research topics
- Upgrade to paid Gemini API tier

### Events Not Triggering

**Problem:** Next agent doesn't run after previous completion

**Checklist:**
1. Verify `subscribes` array matches `emits` array
2. Check logs for errors in previous agent
3. Ensure BullMQ plugin is configured
4. Restart dev server

### State Not Persisting

**Problem:** Can't retrieve research data

**Solution:**
1. Check Redis is running: `redis-cli ping`
2. Verify states plugin in `motia.config.ts`
3. Check namespace and key match between set/get

### TypeScript Errors

**Problem:** Type errors in handlers

**Solution:**
```bash
# Regenerate types after adding new steps
npm run generate-types
```

### Gemini Model Not Found

**Problem:**
```
Error: models/gemini-pro not found
```

**Solution:**
Update all agents to use `gemini-2.5-flash`:
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
```

## Advanced Patterns

### Adding Parallel Processing

Make research topics process in parallel:

```typescript
// Instead of sequential loop
const findingsPromises = plan.research_topics.map(topic =>
  processTopicWithRetry(topic, query, model, logger)
)
const findings = await Promise.all(findingsPromises)
```

### Adding Conditional Logic

Skip agents based on conditions:

```typescript
// In planning agent
if (depth === 'quick') {
  await emit({ topic: 'research.completed', data: { /* ... */ } })
  // Skip research agent
} else {
  await emit({ topic: 'plan.completed', data: { /* ... */ } })
}
```

### Adding Error Recovery

Implement fallback behavior:

```typescript
try {
  const result = await model.generateContent(prompt)
  // Process result
} catch (error) {
  // Emit error event for alternative handler
  await emit({
    topic: 'agent.failed',
    data: { agentName, error, retryable: true }
  })
}
```

### Streaming Responses

Stream results as they're generated:

```typescript
// In synthesis agent
const stream = await model.generateContentStream(prompt)
for await (const chunk of stream) {
  await emit({
    topic: 'report.chunk',
    data: { researchId, chunk: chunk.text() }
  })
}
```

## Next Steps

### 1. Add Database Persistence

Replace in-memory state with PostgreSQL/MongoDB:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Instead of state.set()
await prisma.research.create({ data: researchData })
```

### 2. Add Authentication

Protect endpoints with auth middleware:

```typescript
export const config: ApiRouteConfig = {
  // ...
  middleware: [authMiddleware]
}
```

### 3. Add Caching

Cache Gemini responses to reduce API calls:

```typescript
const cacheKey = `gemini:${hash(prompt)}`
let result = await cache.get(cacheKey)
if (!result) {
  result = await model.generateContent(prompt)
  await cache.set(cacheKey, result, { ttl: 3600 })
}
```

### 4. Add Web Interface

Create a UI to display research reports:

```typescript
// Add UI step
export const config: UIConfig = {
  type: 'ui',
  path: '/research/:id',
  // Render research results
}
```

### 5. Deploy to Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Resources

- [Motia Documentation](https://motia.dev/docs)
- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Event-Driven Architecture Guide](https://motia.dev/docs/concepts/overview)
- [API Reference](https://motia.dev/docs/api-reference)
- [Motia Examples](https://github.com/motiadev/motia-examples)

## Summary

You've successfully built a multi-agent AI system with Motia! You learned:

✅ How to orchestrate multiple AI agents sequentially  
✅ How to use event-driven architecture for decoupled workflows  
✅ How to integrate Google Gemini for AI processing  
✅ How to handle API rate limits with retry logic  
✅ How to manage state across async operations  
✅ How to monitor workflows with the Motia Workbench  
✅ How to build scalable, production-ready AI systems  

This foundation can be extended with parallel processing, conditional logic, error recovery, streaming, and much more!

---

# Event-Driven User Registration Workflow

A complete step-by-step guide to building event-driven workflows using the Motia framework. This tutorial demonstrates how to create a user registration system that automatically triggers welcome emails, account setup, and notification logging through events.

## What is Event-Driven Architecture?

Event-driven architecture is a design pattern where components communicate through events rather than direct function calls. In Motia:

- **API Steps** can **emit events** when something happens
- **Event Steps** **subscribe to events** and process them asynchronously
- This creates **decoupled, scalable workflows** where steps don't need to know about each other

### Benefits:
- ✅ **Decoupled** - Components work independently
- ✅ **Scalable** - Event handlers can process in parallel
- ✅ **Resilient** - Failures in one step don't affect others
- ✅ **Flexible** - Easy to add new event handlers without changing existing code

## Event-Driven Project Structure

```
event-driven-workflow/
├── src/
│   └── users/                          # User registration workflow
│       ├── register-user.step.ts        # API: Register user & emit event
│       ├── send-welcome-email.step.ts   # Event: Send welcome email
│       ├── setup-account.step.ts        # Event: Setup user account
│       ├── log-notification.step.ts     # Event: Log notifications
│       └── get-user-status.step.ts      # API: Check user status
├── motia.config.ts
├── package.json
└── tsconfig.json
```

## Event-Driven Implementation Steps

### Step 1: Create the User Registration API Endpoint

This endpoint receives user registration data and emits an event to trigger the workflow.

**Create `src/users/register-user.step.ts`:**

```typescript
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'RegisterUser',
  description: 'Register a new user and trigger welcome workflow',
  method: 'POST',
  path: '/users/register',
  flows: ['user-registration'],
  emits: ['user.registered'],  // 🔥 This step emits an event
  
  bodySchema: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),

  responseSchema: {
    201: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      status: z.string(),
      createdAt: z.string(),
    }),
  },
}

export const handler: Handlers['RegisterUser'] = async (req, { emit, logger, state }) => {
  const { name, email, password } = req.body

  logger.info('Registering new user', { name, email })

  const userId = `user-${Date.now()}`
  
  const userData = {
    userId,
    name,
    email,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  await state.set('users', userId, userData)

  // 🔥 Emit event - this triggers all subscribers
  await emit({
    topic: 'user.registered',
    data: { userId, name, email },
  })

  logger.info('User registered successfully', { userId })

  return {
    status: 201,
    body: userData,
  }
}
```

**Key Points:**
- `emits: ['user.registered']` declares what events this step can emit
- `emit()` sends the event to all subscribers
- The API responds immediately - event processing happens asynchronously

### Step 2: Create Welcome Email Event Handler

This event handler listens for `user.registered` events and sends a welcome email.

**Create `src/users/send-welcome-email.step.ts`:**

```typescript
import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: EventConfig = {
  type: 'event',
  name: 'SendWelcomeEmail',
  description: 'Send welcome email to newly registered users',
  flows: ['user-registration'],
  subscribes: ['user.registered'],  // 🔥 This step listens for events
  emits: ['email.sent'],             // 🔥 And emits another event
  
  input: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
  }),
}

export const handler: Handlers['SendWelcomeEmail'] = async (input, { emit, logger, state }) => {
  const { userId, name, email } = input

  logger.info('Sending welcome email', { userId, email })

  // Simulate sending email
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Store email record
  await state.set('emails', `welcome-${userId}`, {
    userId,
    email,
    type: 'welcome',
    subject: `Welcome ${name}!`,
    sentAt: new Date().toISOString(),
  })

  // 🔥 Emit another event
  await emit({
    topic: 'email.sent',
    data: {
      userId,
      email,
      type: 'welcome',
      sentAt: new Date().toISOString(),
    },
  })

  logger.info('Welcome email workflow completed', { userId })
}
```

**Key Points:**
- `type: 'event'` marks this as an event handler
- `subscribes: ['user.registered']` means this runs when that event is emitted
- Event handlers receive the event data as `input`
- Can emit new events to create event chains

### Step 3: Create Account Setup Event Handler

This handler also subscribes to `user.registered` and runs in parallel with the email handler.

**Create `src/users/setup-account.step.ts`:**

```typescript
import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: EventConfig = {
  type: 'event',
  name: 'SetupUserAccount',
  description: 'Setup user account with default settings and preferences',
  flows: ['user-registration'],
  subscribes: ['user.registered'],  // 🔥 Same event, different handler
  emits: [],
  
  input: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
  }),
}

export const handler: Handlers['SetupUserAccount'] = async (input, { emit, logger, state }) => {
  const { userId, name, email } = input

  logger.info('Setting up user account', { userId })

  // Create default settings
  const userSettings = {
    userId,
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC',
  }

  // Create default profile
  const userProfile = {
    userId,
    name,
    email,
    bio: '',
    avatar: 'https://via.placeholder.com/150',
    joinedAt: new Date().toISOString(),
  }

  await new Promise((resolve) => setTimeout(resolve, 800))

  // Save to state
  await state.set('user-settings', userId, userSettings)
  await state.set('user-profiles', userId, userProfile)

  // Update user status to active
  const userData = await state.get('users', userId) as {
    userId: string
    name: string
    email: string
    status: string
    createdAt: string
  } | null
  
  if (userData) {
    await state.set('users', userId, {
      ...userData,
      status: 'active',
      updatedAt: new Date().toISOString(),
    })
  }

  logger.info('Account setup workflow completed', { userId })
}
```

**Key Points:**
- Multiple event handlers can subscribe to the same event
- They run **in parallel** asynchronously
- Each handler is independent and can fail without affecting others

### Step 4: Create Notification Logger Event Handler

This handler subscribes to `email.sent` events, creating a secondary event chain.

**Create `src/users/log-notification.step.ts`:**

```typescript
import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: EventConfig = {
  type: 'event',
  name: 'LogNotification',
  description: 'Log all email notifications and store notification history',
  flows: ['user-registration'],
  subscribes: ['email.sent'],  // 🔥 Subscribes to emails sent event
  emits: [],
  
  input: z.object({
    userId: z.string(),
    email: z.string(),
    type: z.string(),
    sentAt: z.string(),
  }),
}

export const handler: Handlers['LogNotification'] = async (input, { logger, state }) => {
  const { userId, email, type, sentAt } = input

  logger.info('Logging notification', { userId, type, email })

  // Create log entry
  const notificationLog = {
    userId,
    email,
    type,
    sentAt,
    loggedAt: new Date().toISOString(),
  }

  // Store log
  const logId = `${userId}-${type}-${Date.now()}`
  await state.set('notification-logs', logId, notificationLog)

  // Update notification count
  const userNotifications = (await state.get('notification-counts', userId) as { count: number } | null) || { count: 0 }
  await state.set('notification-counts', userId, {
    count: userNotifications.count + 1,
    lastNotification: sentAt,
  })

  logger.info('Notification logged successfully', { userId, logId })
}
```

### Step 5: Create Status Check API Endpoint

This endpoint allows checking the completion status of the workflow.

**Create `src/users/get-user-status.step.ts`:**

```typescript
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'GetUserStatus',
  description: 'Get user registration status and details',
  method: 'GET',
  path: '/users/:userId/status',
  flows: ['user-registration'],
  emits: [],
  
  responseSchema: {
    200: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      status: z.string(),
      createdAt: z.string(),
      emailSent: z.boolean(),
      accountSetup: z.boolean(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['GetUserStatus'] = async (req, { logger, state }) => {
  const { userId } = req.pathParams

  logger.info('Fetching user status', { userId })

  const userData = await state.get('users', userId) as {
    userId: string
    name: string
    email: string
    status: string
    createdAt: string
  } | null

  if (!userData) {
    return {
      status: 404,
      body: { error: 'User not found' },
    }
  }

  // Check workflow completion
  const emailRecord = await state.get('emails', `welcome-${userId}`)
  const userSettings = await state.get('user-settings', userId)

  return {
    status: 200,
    body: {
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      status: userData.status,
      createdAt: userData.createdAt,
      emailSent: !!emailRecord,
      accountSetup: !!userSettings,
    },
  }
}
```

## Event Flow Visualization

```
┌─────────────────────────┐
│  POST /users/register   │
│   (RegisterUser API)    │
└───────────┬─────────────┘
            │ emits: user.registered
            │
            ├──────────────┬──────────────┐
            │              │              │
            ▼              ▼              ▼
┌─────────────────┐ ┌────────────────┐  │
│ SendWelcomeEmail│ │ SetupUserAccount│  │
│   (Event Step)  │ │  (Event Step)  │  │
└────────┬────────┘ └────────────────┘  │
         │ emits:                        │
         │ email.sent                    │
         ▼                               │
┌─────────────────┐                     │
│ LogNotification │                     │
│   (Event Step)  │                     │
└─────────────────┘                     │
                                        │
         ┌──────────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ GET /users/:id/status    │
│  (GetUserStatus API)     │
└──────────────────────────┘
```

## Testing the Event-Driven Workflow

### Step 1: Register a New User

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepass123"
  }' | jq .
```

**Response:**
```json
{
  "userId": "user-1706435232000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "status": "pending",
  "createdAt": "2024-01-28T10:30:00.000Z"
}
```

### Step 2: Check User Status (Wait 2-3 seconds)

```bash
curl http://localhost:3000/users/user-1706435232000/status | jq .
```

**Response:**
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

**Notice:**
- Status changed from `"pending"` to `"active"`
- `emailSent` and `accountSetup` are both `true`
- All event handlers completed successfully!

## Understanding Event Flow

### Event Emission
```typescript
// In RegisterUser API step
await emit({
  topic: 'user.registered',  // Event name
  data: { userId, name, email }  // Event payload
})
```

### Event Subscription
```typescript
// In SendWelcomeEmail event step
export const config: EventConfig = {
  subscribes: ['user.registered'],  // Listen for this event
  // ...
}

export const handler = async (input, { emit, logger, state }) => {
  // input contains the event data
  const { userId, name, email } = input
  // Process the event...
}
```

### Event Chaining
Events can trigger other events, creating powerful workflows:
1. `user.registered` → Triggers SendWelcomeEmail and SetupUserAccount
2. `email.sent` → Triggers LogNotification

### Parallel Execution
When multiple event handlers subscribe to the same event:
- They run **asynchronously** in parallel
- Failures in one handler don't affect others
- Each handler is independent

## Key Event-Driven Concepts

### 1. Event Topics
- Events are identified by **topic names** (strings)
- Use descriptive names like `user.registered`, `email.sent`
- Follow naming conventions: `resource.action` format

### 2. Event Data
- Events carry **data payloads** (JSON objects)
- Use Zod schemas to validate event data
- Keep event data minimal - only what subscribers need

### 3. Flows Property
```typescript
flows: ['user-registration']
```
- Groups related steps for visualization in Workbench
- Multiple steps with the same flow name appear together
- Helps understand how your system is organized

### 4. State Management
```typescript
await state.set('namespace', 'key', value)
const value = await state.get('namespace', 'key')
```
- State persists data across steps
- Organized by **namespaces** (like 'users', 'emails')
- Perfect for storing workflow state

## Event-Driven Patterns

### 1. Fan-Out Pattern
One event triggers multiple handlers:
```
user.registered → [SendEmail, SetupAccount, NotifyAdmin, CreateProfile]
```

**What it is:** A single event is broadcast to multiple independent event handlers that all process it simultaneously in parallel.

**When to use:**
- When you need to perform multiple independent operations in response to a single event
- When operations don't depend on each other
- When you want to maximize parallel processing

**Example from our workflow:**
```typescript
// One event: user.registered
await emit({ topic: 'user.registered', data: { userId, name, email } })

// Multiple handlers listening to the same event:
// 1. SendWelcomeEmail - sends email
// 2. SetupUserAccount - creates user settings
// Both run in parallel, independently
```

**Real-world use cases:**
- User signs up → [Send welcome email, Create profile, Notify admin, Add to mailing list, Log analytics]
- Order placed → [Send confirmation email, Update inventory, Process payment, Notify warehouse]
- New article published → [Send to subscribers, Update search index, Generate social media posts]

**Benefits:**
- ✅ Parallel execution reduces total processing time
- ✅ Easy to add new handlers without changing existing code
- ✅ Handlers are isolated - if one fails, others continue
- ✅ Scales horizontally - each handler can run on different servers

### 2. Sequential Processing (Event Chaining)
Events trigger events in sequence:
```
order.created → payment.processed → inventory.updated → shipping.scheduled
```

**What it is:** Each step in the workflow emits an event that triggers the next step, creating a sequential chain of operations.

**When to use:**
- When steps must happen in a specific order
- When each step depends on the output of the previous step
- When you need to track progress through a multi-stage process

**Example from our workflow:**
```typescript
// Step 1: User registers (emits user.registered)
await emit({ topic: 'user.registered', data: { userId, name, email } })

// Step 2: Email sent (subscribes to user.registered, emits email.sent)
export const config: EventConfig = {
  subscribes: ['user.registered'],
  emits: ['email.sent']
}
await emit({ topic: 'email.sent', data: { userId, email, type: 'welcome' } })

// Step 3: Log notification (subscribes to email.sent)
export const config: EventConfig = {
  subscribes: ['email.sent'],  // Triggered by previous step
  emits: []
}

// Flow: user.registered → email.sent → notification logged
```

**Real-world use cases:**
- E-commerce: Order → Payment → Fulfillment → Shipping → Delivery
- Content publishing: Draft → Review → Approve → Publish → Notify subscribers
- User onboarding: Register → Verify email → Complete profile → Grant access
- Data pipeline: Extract → Transform → Validate → Load → Index

**Benefits:**
- ✅ Clear progression through workflow stages
- ✅ Each step can be tested independently
- ✅ Easy to add new steps in the chain
- ✅ Failed steps can retry without restarting the entire workflow

### 3. Saga Pattern (Distributed Transactions)
Coordinate complex transactions across multiple services:
```
booking.started → [flight.reserved, hotel.reserved, car.reserved] → booking.confirmed
                                    ↓ (any fails)
                            [flight.cancelled, hotel.cancelled, car.cancelled]
```

**What it is:** A pattern for managing data consistency across distributed services using a sequence of local transactions, with compensating actions to undo changes if any step fails.

**When to use:**
- When you need to coordinate transactions across multiple services
- When you can't use traditional ACID transactions
- When you need to maintain data consistency in distributed systems
- When failures require rolling back changes across services

**How it works:**

**Forward Flow (Happy Path):**
```typescript
// Step 1: Start booking
await emit({ 
  topic: 'booking.started', 
  data: { bookingId, userId, flightId, hotelId, carId } 
})

// Step 2-4: Parallel reservations (Fan-out)
// Each service reserves and emits success
await emit({ topic: 'flight.reserved', data: { bookingId, flightId } })
await emit({ topic: 'hotel.reserved', data: { bookingId, hotelId } })
await emit({ topic: 'car.reserved', data: { bookingId, carId } })

// Step 5: All successful - confirm booking
await emit({ topic: 'booking.confirmed', data: { bookingId } })
```

**Compensating Flow (Failure Path):**
```typescript
// If hotel reservation fails...
await emit({ 
  topic: 'hotel.reservation.failed', 
  data: { bookingId, hotelId, reason: 'No availability' } 
})

// Trigger compensating actions (rollback)
await emit({ topic: 'flight.cancellation.requested', data: { bookingId, flightId } })
await emit({ topic: 'car.cancellation.requested', data: { bookingId, carId } })

// Final state
await emit({ topic: 'booking.cancelled', data: { bookingId, reason: 'Hotel unavailable' } })
```

**Implementation Example:**
```typescript
// Coordinator Step - tracks saga state
export const config: EventConfig = {
  name: 'BookingSagaCoordinator',
  subscribes: [
    'booking.started',
    'flight.reserved', 'flight.reservation.failed',
    'hotel.reserved', 'hotel.reservation.failed',
    'car.reserved', 'car.reservation.failed'
  ],
  emits: [
    'booking.confirmed', 
    'booking.cancelled',
    'flight.cancellation.requested',
    'hotel.cancellation.requested',
    'car.cancellation.requested'
  ]
}

export const handler = async (input, { emit, state }) => {
  const sagaState = await state.get('saga', input.bookingId) || {
    flight: 'pending',
    hotel: 'pending',
    car: 'pending'
  }
  
  // Update state based on event
  if (input.topic === 'flight.reserved') {
    sagaState.flight = 'reserved'
  } else if (input.topic === 'flight.reservation.failed') {
    sagaState.flight = 'failed'
    // Trigger compensating actions
    await emit({ topic: 'hotel.cancellation.requested', data: input })
    await emit({ topic: 'car.cancellation.requested', data: input })
    await emit({ topic: 'booking.cancelled', data: input })
    return
  }
  
  // Check if all steps completed
  if (sagaState.flight === 'reserved' && 
      sagaState.hotel === 'reserved' && 
      sagaState.car === 'reserved') {
    await emit({ topic: 'booking.confirmed', data: input })
  }
  
  await state.set('saga', input.bookingId, sagaState)
}
```

**Real-world use cases:**
- Travel booking systems (flights + hotels + cars)
- E-commerce orders (payment + inventory + shipping)
- Financial transactions (debit one account + credit another)
- Multi-service registration (create user + create profile + setup permissions)

**Benefits:**
- ✅ Maintains consistency across distributed services
- ✅ Handles failures gracefully with compensating actions
- ✅ No need for distributed locks or two-phase commits
- ✅ Each service maintains its own database
- ✅ Services remain loosely coupled

**Key Saga Concepts:**

1. **Compensating Transactions**: Actions that undo a previous operation
   - If flight is reserved → compensation is flight cancellation
   - If payment is processed → compensation is refund

2. **Idempotency**: Each step should be safely retryable
   - Use unique IDs to prevent duplicate processing
   - Store state to track what's been completed

3. **State Management**: Track progress of the saga
   - Store which steps completed successfully
   - Store which steps need compensation
   - Use state to decide next actions

**Comparison of Patterns:**

| Pattern | Execution | Use Case | Complexity |
|---------|-----------|----------|------------|
| **Fan-Out** | Parallel | Independent operations | Low |
| **Sequential** | Series | Dependent operations | Low |
| **Saga** | Mixed | Distributed transactions | High |

**Combining Patterns:**

You can combine these patterns in complex workflows:

```
Order Placed (API)
    ↓
order.created (Fan-out)
    ├→ Send confirmation email
    ├→ Update analytics
    └→ Start payment saga (Saga)
            ↓
        payment.authorized (Sequential)
            ↓
        inventory.reserved (Sequential)
            ↓
        shipping.scheduled
            ↓
        order.completed
```

---

## Resources

- [Motia Documentation](https://motia.dev/docs)
- [Event-Driven Architecture Guide](https://motia.dev/docs/concepts/event-driven)
- [REST API Best Practices](https://motia.dev/docs/getting-started/build-your-first-app/creating-your-first-rest-api)
- [Workbench Guide](https://motia.dev/docs/concepts/workbench)
- [State Management](https://motia.dev/docs/concepts/state)
- [Zod Schema Validation](https://zod.dev)

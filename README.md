# Task Management REST API with Motia - Complete Tutorial

This is a complete step-by-step guide to building REST API endpoints with CRUD (Create, Read, Update, Delete) operations using the Motia framework. This tutorial demonstrates how to create a task management API from scratch, including setup, implementation, testing, and visualization in the Motia Workbench.

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
│   └── hello/              # Example hello world API
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

Create `src/tasks/task-store.ts` - an in-memory store for managing tasks:

```typescript
// src/tasks/task-store.ts
// Simple in-memory store for tasks
interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

class TaskStore {
  private tasks: Map<string, Task> = new Map()

  constructor() {
    // Initialize with some sample tasks
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Learn Motia Framework',
        description: 'Get familiar with Motia API endpoints',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Build REST API',
        description: 'Create CRUD endpoints for tasks',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    sampleTasks.forEach((task) => this.tasks.set(task.id, task))
  }

  list(): Task[] {
    return Array.from(this.tasks.values())
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.tasks.set(newTask.id, newTask)
    return newTask
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const task = this.tasks.get(id)
    if (!task) return null

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.tasks.set(id, updatedTask)
    return updatedTask
  }

  remove(id: string): boolean {
    return this.tasks.delete(id)
  }
}

export const taskStore = new TaskStore()
```

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

## Resources

- [Motia Documentation](https://motia.dev/docs)
- [REST API Best Practices](https://motia.dev/docs/getting-started/build-your-first-app/creating-your-first-rest-api)
- [Zod Schema Validation](https://zod.dev)

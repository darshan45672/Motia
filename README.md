# Motia Framework - Complete Tutorials

This repository contains comprehensive tutorials for building applications with the Motia framework. Learn how to create REST APIs with CRUD operations and event-driven workflows.

## 📚 Tutorials

### 1. [Task Management REST API](#task-management-rest-api) 
Learn how to build REST API endpoints with full CRUD operations using Motia.

### 2. [Event-Driven User Registration Workflow](#event-driven-user-registration-workflow)
Learn how to build event-driven workflows with asynchronous event processing.

---

# Task Management REST API

A complete step-by-step guide to building REST API endpoints with CRUD (Create, Read, Update, Delete) operations using the Motia framework.

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

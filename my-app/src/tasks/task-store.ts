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
  fs.writeFileSync(FILE, JSON.stringify(db))
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
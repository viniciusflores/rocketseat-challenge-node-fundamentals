import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query

      let tasks

      if(title && description){
        tasks = database.select('tasks', {
          title,
          description
        })
      } else if(title) {
          tasks = database.select('tasks', {
            title,
        })
      } else if(description) {
          tasks = database.select('tasks', {
            description,
        })
      } else {
        tasks = database.select('tasks')
      }

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.select('tasks', { id })

      if(task.length === 0){
        return res.writeHead(404).end('Task not found')
      }

      const { title, description } = req.body

      const updatedTask = {
        ...task[0],
        title: title ?? task[0].title,
        description: description ?? task[0].description,
        updated_at: Date.now()
      }

      database.update('tasks', id, updatedTask)

      res.end(JSON.stringify(updatedTask));
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', { id })

      if(task.length === 0){
        return res.writeHead(404).end('Task not found')
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', { id })

      if(task.length === 0){
        return res.writeHead(404).end('Task not found')
      }

      const updatedTask = {
        ...task[0],
        completed_at: task[0].completed_at === null ? Date.now() : null,
        updated_at: Date.now()
      }

      database.update('tasks', id, updatedTask)

      return res.writeHead(200).end()
    }
  },
]

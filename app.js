import { randomUUID } from 'node:crypto'
import express, { json } from 'express'

import { validateTask, validatePartialTask } from './src/schemas/tasks.js'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const tasks = require('./src/data/tasks.json')

const app = express()

// para poder acceder correctamente al req.body cuando recibimos datos en json.
app.use(json())

// deshabilita el header 'X-Powered-By: Express'
app.disable('x-powered-by')

const ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://luchofseven.com.ar'
]

// recuperar todas las tareas (pueden ser también las que estén solamente completadas).
app.get('/tasks', (req, res) => {
  const origin = req.header('origin')

  if (ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { status } = req.query

  if (status) {
    if (status.toLocaleLowerCase() === 'completed') {
      const booleanStatus = Boolean(status)
      const filteredTasks = tasks.filter(task => task.completed === booleanStatus)

      return res.json(filteredTasks)
    }
  }

  res.json(tasks)
})

// recuperar una sola tarea.
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params
  const task = tasks.find(movie => movie.id === id)
  if (task) return res.json(task)

  res.status(404).json({ message: 'Taks not found' })
})

// crear una nueva tarea.
app.post('/tasks', (req, res) => {
  const result = validateTask(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newTask = {
    id: randomUUID(),
    ...result.data
  }

  tasks.push(newTask)

  res.status(201).json(newTask)
})

// actualizar una tarea.
app.patch('/tasks/:id', (req, res) => {
  const result = validatePartialTask(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const taskIndex = tasks.findIndex(task => task.id === id)

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }

  const updateTask = {
    ...tasks[taskIndex],
    ...result.data
  }

  tasks[taskIndex] = updateTask

  res.json(updateTask)
})

// eliminar una tarea.
app.delete('/tasks/:id', (req, res) => {
  const origin = req.header('origin')

  if (ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { id } = req.params
  const taskIndex = tasks.findIndex(task => task.id === id)

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }

  tasks.splice(taskIndex, 1)

  res.json({ message: 'Taks deleted' })
})

// configurar el header de options para no tener problemas de CORS en algunas solicitudes como el DELETE.
app.options('/tasks/:id', (req, res) => {
  const origin = req.header('origin')

  if (ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DETELE')
  }

  res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})

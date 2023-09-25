import { validatePartialTask, validateTask } from '../schemas/tasks.js'
import { ORIGINS } from '../utils/origins.js'

export class TaskController {
  constructor ({ taskModel }) {
    this.taskModel = taskModel
  }

  getAll = async (req, res) => {
    const origin = req.header('origin')

    if (ORIGINS.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin)
    }

    const { status } = req.query
    const tasks = await this.taskModel.getAll({ status })

    res.json(tasks)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const task = await this.taskModel.getById({ id })
    if (task) return res.json(task)
    res.status(404).json({ message: 'Taks not found' })
  }

  create = async (req, res) => {
    const result = validateTask(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const newTask = await this.taskModel.create({ input: result.data })

    res.status(201).json(newTask)
  }

  update = async (req, res) => {
    const result = validatePartialTask(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedTask = await this.taskModel.update({ id, input: result.data })

    if (updatedTask === false) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(updatedTask)
  }

  delete = async (req, res) => {
    const origin = req.header('origin')

    if (ORIGINS.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin)
    }

    const { id } = req.params
    const result = await this.taskModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Taks deleted' })
  }

  options = async (req, res) => {
    const origin = req.header('origin')

    if (ORIGINS.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DETELE')
    }

    res.send(200)
  }
}

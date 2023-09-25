import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils/read-json.js'

const tasks = readJSON('../data/tasks.json')

export class TaskModel {
  static async getAll ({ status }) {
    if (status) {
      if (status.toLocaleLowerCase() === 'completed') {
        const booleanStatus = Boolean(status)
        const filteredTasks = tasks.filter(task => task.completed === booleanStatus)

        return filteredTasks
      }
    }
    return tasks
  }

  static async getById ({ id }) {
    const task = tasks.find(task => task.id === id)
    return task
  }

  static async create ({ input }) {
    const newTask = {
      id: randomUUID(),
      ...input
    }

    tasks.push(newTask)

    return newTask
  }

  static async update ({ id, input }) {
    const taskIndex = tasks.findIndex(task => task.id === id)
    if (taskIndex === -1) return false

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...input
    }

    return tasks[taskIndex]
  }

  static async delete ({ id }) {
    const taskIndex = tasks.findIndex(task => task.id === id)
    if (taskIndex === -1) return false
    tasks.splice(taskIndex, 1)
    return true
  }
}

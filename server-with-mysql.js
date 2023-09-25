import { createApp } from './app.js'
import { TaskModel } from './src/models/mysql/task.js'

createApp({ taskModel: TaskModel })

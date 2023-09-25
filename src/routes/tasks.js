import { Router } from 'express'
import { TaskController } from '../controllers/tasks.js'

export const createTaskRouter = ({ taskModel }) => {
  const tasksRouter = Router()

  const taskController = new TaskController({ taskModel })

  // recuperar todas las tareas (pueden ser también las que estén solamente completadas).
  tasksRouter.get('/', taskController.getAll)
  // recuperar una sola tarea.
  tasksRouter.get('/:id', taskController.getById)
  // crear una nueva tarea.
  tasksRouter.post('/', taskController.create)
  // actualizar una tarea.
  tasksRouter.patch('/:id', taskController.update)
  // eliminar una tarea.
  tasksRouter.delete('/:id', taskController.delete)
  // configurar el header de options para no tener problemas de CORS en algunas solicitudes como el DELETE.
  tasksRouter.options('/:id', taskController.options)

  return tasksRouter
}

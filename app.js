import express, { json } from 'express'
import { createTaskRouter } from './src/routes/tasks.js'

export const createApp = ({ taskModel }) => {
  const app = express()

  // para poder acceder correctamente al req.body cuando recibimos datos en json.
  app.use(json())

  // deshabilita el header 'X-Powered-By: Express'
  app.disable('x-powered-by')

  // crear y usar el router con el modelo necesario para el endpoint /tasks.
  app.use('/tasks', createTaskRouter({ taskModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}

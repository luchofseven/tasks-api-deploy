import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'admin',
  database: 'tasksdb'
}

const connection = await mysql.createConnection(config)

export class TaskModel {
  static async getAll ({ status }) {
    if (status) {
      const [tasks] = await connection.query(
        'SELECT BIN_TO_UUID(id) id, title, description, completed FROM tasks WHERE completed = true;'
      )

      return tasks
    }

    const [tasks] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, description, completed FROM tasks;'
    )

    return tasks
  }

  static async getById ({ id }) {
    const [task] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, description, completed FROM tasks WHERE id = UUID_TO_BIN(?);', [id]
    )

    if (task.length === 0) return null

    return task[0]
  }

  static async create ({ input }) {
    const { title, description } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
            `INSERT INTO tasks (id, title, description)
              VALUES (UUID_TO_BIN("${uuid}"), ?, ?);`,
            [title, description]
      )
    } catch (error) {
      throw new Error('Error al crear una nueva tarea.')
    }

    const [task] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, title, description, completed FROM tasks WHERE id = UUID_TO_BIN("${uuid}");`
    )

    return task[0]
  }

  static async update ({ id, input }) {
    try {
      const { title, description, completed } = input
      const boolean = completed ? 1 : 0

      await connection.query(
        'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE BIN_TO_UUID(id) = ?;', [title, description, boolean, id]
      )
    } catch (error) {
      throw new Error('Error al actualizar la tarea.')
    }

    const [task] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, description, completed FROM tasks WHERE id = UUID_TO_BIN(?);', [id]
    )

    return task[0]
  }

  static async delete ({ id }) {
    try {
      await connection.query(
        'DELETE FROM tasks WHERE BIN_TO_UUID(id) = ?;', [id]
      )
    } catch (error) {
      throw new Error('Error al eliminar la tarea.')
    }
  }
}

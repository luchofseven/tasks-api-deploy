const z = require('zod')

const taskScheme = z.object({
  title: z.string(),
  description: z.string().max(255),
  completed: z.boolean().default(false)
})

function validateTask (object) {
  return taskScheme.safeParse(object)
}

function validatePartialTask (object) {
  return taskScheme.partial().safeParse(object)
}

module.exports = {
  validateTask,
  validatePartialTask
}

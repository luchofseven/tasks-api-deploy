import z from 'zod'

const taskScheme = z.object({
  title: z.string(),
  description: z.string().max(255),
  completed: z.boolean().default(false)
})

export function validateTask (object) {
  return taskScheme.safeParse(object)
}

export function validatePartialTask (object) {
  return taskScheme.partial().safeParse(object)
}

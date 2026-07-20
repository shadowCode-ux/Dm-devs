import { z } from 'zod'

export const supportSchema = z.object({
  category: z.enum(['Technical', 'Account', 'Community', 'Other'], {
    errorMap: () => ({ message: 'Select a category' }),
  }),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  details: z.string().min(10, 'Please add a bit more detail'),
})

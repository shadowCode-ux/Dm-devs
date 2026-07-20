import { z } from 'zod'

export const projectSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    tags: z.string().min(1, 'Add at least one tag'),
    url: z.string().url('Enter a valid URL (include https://)').optional().or(z.literal('')),
    codeSnippet: z.string().optional(),
  })
  .refine((data) => data.url || data.codeSnippet, {
    message: 'Provide a project URL, a code snippet, or both',
    path: ['url'],
  })

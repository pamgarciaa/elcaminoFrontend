// src/features/blog/blog.schema.ts
import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
  blogImage: z.any().optional(),
});

export type CreateBlogFields = z.infer<typeof createBlogSchema>;
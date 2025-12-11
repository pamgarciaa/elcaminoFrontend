import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción es muy corta."),
  price: z.coerce.number().min(0.01, "El precio debe ser mayor a 0."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  category: z.string().min(1, "La categoría es obligatoria."),
});

export type CreateProductFields = z.infer<typeof createProductSchema>;

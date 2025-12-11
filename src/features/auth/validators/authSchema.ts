import { z } from "zod";

// --- ESQUEMA DE LOGIN ---
export const loginSchema = z.object({
  email: z
    .string()
    .email("Formato de email no válido")
    .min(1, "El email es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginFormFields = z.infer<typeof loginSchema>;

// --- ESQUEMA DE REGISTRO ---
export const registerSchema = z.object({
  username: z.string().min(3, "El nombre de usuario es obligatorio."),
  name: z.string().min(2, "El nombre es obligatorio."),
  lastName: z.string().min(2, "El apellido es obligatorio."),
  email: z
    .string()
    .email("Formato de email no válido")
    .min(1, "El email es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  address: z.string().optional(),
  phone: z.string().optional(),
  profilePicture: z.any().optional(),
});
export type RegisterFields = z.infer<typeof registerSchema>;

// --- ESQUEMA DE EDICIÓN DE PERFIL ---
export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres.")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, "El nombre es obligatorio.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, "El apellido es obligatorio.")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  profilePicture: z.any().optional(),
});

export type ProfileFields = z.infer<typeof profileSchema>;

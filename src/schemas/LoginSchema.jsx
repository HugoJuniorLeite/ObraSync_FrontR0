// schemas/noteSchema.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  cpfNumber: z.string()
    .min(11, "CPF deve ter pelo menos 11 dígitos")
    .max(14, "CPF inválido"), // aceita com ou sem máscara
  password: z.string().optional(),
  old_password: z.string().optional(),
  new_password: z.string().optional(),
});
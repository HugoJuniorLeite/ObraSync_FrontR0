// schemas/noteSchema.ts
import { z } from 'zod';

export const LoginSchema = z.object({
   cpfNumber: z
    .string()
    .transform((v) => v.replace(/\D/g, "")) // 🔥 normaliza
    .refine((v) => v.length === 11, {
      message: "CPF inválido",
    })
    ,
  password: z.string().optional(),
  old_password: z.string().optional(),
  new_password: z.string().optional(),
});
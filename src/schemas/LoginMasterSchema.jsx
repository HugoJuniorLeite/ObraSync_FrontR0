// schemas/noteSchema.ts
import { z } from 'zod';

export const LoginMasterSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Campo obrigatório"),
});
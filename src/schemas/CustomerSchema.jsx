import { z } from "zod";

export const CustomerSchema = z.object({
  customerName: z
    .string()
    .min(2, "O nome do cliente deve ter pelo menos 2 caracteres"),

  customerEmail: z
    .string()
    .email("Insira um e-mail válido"),

  customerCNPJ: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido. Use o formato 00.000.000/0000-00"),
});

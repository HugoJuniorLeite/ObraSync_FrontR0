import { z } from "zod";

export const EmployeeSchema = z.object({
  employeeName: z.string().min(3, "Nome é obrigatório"),
  birthDate: z.string(),
  rgNumber: z.string().regex(/^\d{2}\.\d{3}\.\d{3}-\d{2}$/, "RG inválido. Use o formato 00.000.000-00"),
  cpfNumber: z.string(),
  phoneNumber: z.string()
    .regex(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/, "Telefone inválido"),
  addressNumber: z.string(),
  admissionDate: z.string(),

  driversLicense: z.boolean().default(false),

  cnhCategory: z.string().optional(),
  cnhNumber: z.string().optional(),
  cnhValidity: z.string().optional(),
  firstDriversLicense: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.driversLicense) {
    if (!data.cnhCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Categoria da CNH é obrigatória",
        path: ["cnhCategory"],
      });
    }
    if (!data.cnhNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número da CNH é obrigatório",
        path: ["cnhNumber"],
      });
    }
    if (!data.cnhValidity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Validade da CNH é obrigatória",
        path: ["cnhValidity"],
      });
    }
    if (!data.firstDriversLicense) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data da 1ª habilitação é obrigatória",
        path: ["firstDriversLicense"],
      });
    }
  }
});

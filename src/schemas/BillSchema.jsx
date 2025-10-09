import { z } from "zod";

export const BillSchema = z.object({
  selectedOptionTechnician: z.string().min(1, "Ocupação é obrigatória"),
  descriptionOccupation: z.string().min(1, "Descrição é obrigatória"),
  programDate: z.string(),

  // sameAddress: z.boolean().optional(),
});
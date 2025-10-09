import { z } from "zod";

export const CreateOccupationSchema = z.object({
  occupationName: z.string().min(1, "Ocupação é obrigatória"),
  descriptionOccupation: z.string().min(1, "Descrição é obrigatória"),
    priceSalary: z
    .number({ invalid_type_error: 'Digite um valor numérico válido' })
    .min(0.01, 'O valor deve ser maior que zero'),
  selectedOption: z.boolean({
    required_error: "Selecione Sim ou Não para periculosidade"
  }),

});

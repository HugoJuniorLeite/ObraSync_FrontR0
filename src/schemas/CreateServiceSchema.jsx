import { z } from "zod";

export const CreateServiceSchema = z.object({
  serviceName: z
    .string()
    .min(2, "O nome do serviço deve ter pelo menos 2 caracteres"),

  descriptionService: z
    .string()
    .min(15, "A descrição deve ter pelo menos 15 caracteres"),

  priceService: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: "Digite um valor numérico válido" })
      .min(0.01, "O valor deve ser maior que zero")
  ),

  selectedOption: z
    .string()
    .min(1, "Selecione um contrato válido"),

  selectedOptionService: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Selecione pelo menos um cargo"),
});


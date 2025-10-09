import { z } from "zod";

export const CreateOsSchema = z.object({
  // customerName: z
  //   .string()
  //   .min(3, "Nome do cliente deve ter pelo menos 3 caracteres"),

  // customerPhone: z
  //   .string()
  //   .regex(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/, "Telefone inválido"),
  addressNumber: z
    .string()
    .min(1, "Número do endereço é obrigatório"),
  zipCode: z.string(),
  street: z.string().min(1, "Endereço é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),

  sameAddress: z.boolean().default(false),

  // Campos opcionais do endereço de ramal (só obrigatórios se sameAddress for true)
  addressNumberExtension: z.string().optional(),
  zipCodeExtension: z.string().optional(),
  streetExtension: z.string().optional(),
  neighborhoodExtension: z.string().optional(),
  cityExtension: z.string().optional(),
  stateExtension: z.string().optional(),

  // consultantName: z
  //   .string()
  //   .min(3, "Nome do consultor deve ter pelo menos 3 caracteres"),

  // consultantPhone: z
  //   .string()
  //   .regex(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/, "Telefone inválido"),

  selectedOptionService: z
    .array(
      z.object({
        value: z.number().min(1, "ID do serviço é obrigatório"),
        label: z.string().min(1, "Nome do serviço é obrigatório"),
      })
    )
    .min(1, "Selecione pelo menos um serviço"),

  // selectedOptionProject: z
  //   .string()
  //   .min(1, "Selecione um projeto"),
});

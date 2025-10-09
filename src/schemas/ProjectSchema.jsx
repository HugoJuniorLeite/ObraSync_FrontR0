import { z } from 'zod';

export const ProjectSchema = z.object({
  contractName: z.string().min(1, 'Informe o nome do contrato'),
  contractNumber: z.string().min(1, 'Informe o número do contrato'),
  selectedOption: z.string().min(1, "Selecione um cliente"),
  responsibleContract: z.string().min(1, 'Informe o nome do contrato'),
  contracDescription: z.string().min(1, 'Informe a descrição do contrato'),
  startDate: z.string().min(1, 'Informe a data de início do contrato'),
  endDate: z.string().min(1, 'Informe a data de término do contrato'),
  valor: z
    .number({ invalid_type_error: 'Digite um valor numérico válido' })
    .min(0.01, 'O valor deve ser maior que zero'),

});

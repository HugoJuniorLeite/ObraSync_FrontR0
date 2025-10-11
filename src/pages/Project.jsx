
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTitle, FormWrapper, InputWraper, RowInputData, Select, StyledLabel, SubmitButton } from "../layouts/Theme";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../components/Ui/Input";
import { MoneyInputFallback } from "../components/Ui/MoneyInputFallBack";
import { ProjectSchema } from "../schemas/ProjectSchema";
import ContractList from "../components/ContractList";
import Tabs from "../components/Tabs";
import { useEffect, useState } from "react";
import contract from "../services/apiContract";
import RegisterCustomer from "../components/RegisterCustomer";


export default function Project() {
  const [selectedOption, setSelectedOption] = useState("")
  const [clients, setClients] = useState([])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProjectSchema),
  });


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await contract.getClients();
        setClients(data);
        console.log(data)

      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
  };

  const onSubmit = async ({ contractName, contractNumber, valor, startDate, endDate, contracDescription, responsibleContract, selectedOption }) => {

    const payload = {

      name: contractName,
      number_contract: contractNumber,
      description: contracDescription,
      estimated_price: valor,
      start_date: new Date(startDate),
      estimated_end_date: new Date(endDate),
      responsible_contract: responsibleContract,
      firm_id: selectedOption
    };


    console.log(payload, "onsumit")
    try {
      await contract.postContract(payload);
      setSelectedOption(""); // <- também limpa o select, se necessário
      reset()         // <- isso limpa os campos do formulário
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar o token.");
    }
  }

  const handleFilterChange = (filter) => {
    console.log("Filtro ativo:", filter);
  };

  return (

    <FormWrapper>

      <FormTitle>Cadastrar Projeto</FormTitle>
      <InputWraper>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Input
            type="text"
            label="Nome do contrato"
            name="contractName"
            register={register}
            error={errors.contractName}
          />

          <Input
            type="text"
            label="Número do contrato"
            name="contractNumber"
            register={register}
            error={errors.contractNumber}
          />

          <div>
            <StyledLabel >Escolha o cliente</StyledLabel>
            <Select id="select" value={selectedOption}
              {...register("selectedOption")}
              onChange={handleChange}>
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </div>

          <Input
            type="text"
            label="Responsavel do contrato"
            name="responsibleContract"
            register={register}
            error={errors.responsibleContract}
          />

          <Controller
            name="valor"
            control={control}
            defaultValue={0} // ou undefined
            render={({ field }) => (
              <MoneyInputFallback
                label={"Valor previsto do projeto (R$)"}
                {...field}
                error={errors.valor}
              />
            )}
          />

          <Input
            type="text"
            label="Descrição do contrato"
            name="contracDescription"
            register={register}
            error={errors.contracDescription}
          />
          <RowInputData>
            <Input
              type="date"
              label="Início do contrato"
              name="startDate"
              register={register}
              error={errors.startDate}
            />

            <Input
              type="date"
              label="Termino do contrato"
              name="endDate"
              register={register}
              error={errors.endDate}
            />
          </RowInputData>

          <SubmitButton type="submit">
            Salvar
          </SubmitButton>
        </form>



        {/* <RegisterCustomer /> */}

      </InputWraper>
      {/* <Tabs onChange={handleFilterChange} /> */}



    </FormWrapper>

  )
}
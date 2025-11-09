import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "./Ui/Input";
import { customSelectStyles, FormTitle, FormWrapper, InputWraper, StyledLabel, StyledSelect, SubmitButton, TextArea } from "../layouts/Theme";
import { CreateServiceSchema } from "../schemas/CreateServiceSchema";
import contract from "../services/apiContract";
import { useEffect, useState } from "react";
import { MoneyInputFallback } from "./Ui/MoneyInputFallBack";
// import occupation from "../services/apiOccupation";
import Select from "react-select";
import apiOccupation from "../services/apiOccupation";

export default function CreateService() {
  const [selectedOption, setSelectedOption] = useState("")
  const [projects, setProjects] = useState([])
  const [occupations, setOccupations] = useState([])

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sameAddress: false,
      selectedOptionService: [],
      selectedOptionProject: ""
    },
    resolver: zodResolver(CreateServiceSchema),
  });

  const selectedOptionService = watch("selectedOptionService");


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const [dataProject, dataOcupation] = await Promise.all([
          contract.getContracts(),
          apiOccupation.getOccupation(),
        ]);

        setProjects(dataProject);
        setOccupations(dataOcupation);
        console.log(dataOcupation, "occupation")
        console.log(dataProject, "Data")
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





  const onSubmit = async ({ serviceName, descriptionService, priceService, selectedOption, selectedOptionService }) => {

    const payload = {

      name: serviceName,
      description: descriptionService,
      price: priceService,
      project_id: selectedOption,
      occupation_ids: selectedOptionService.map(opt => opt.value),
    };


    console.log(payload, "onsumit")
    try {
      await contract.postService(payload);
      setSelectedOption(""); // <- também limpa o select, se necessário
      reset()         // <- isso limpa os campos do formulário
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar o token.");
    }
  }


  return (
    <FormWrapper>
      <FormTitle> Cadastrar Serviço</FormTitle>
      <InputWraper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Serviço"
          name="serviceName"
          register={register}
          error={errors.serviceName} />

        <TextArea
          rows={3}
          placeholder="Descrição"
          {...register("descriptionService")}
          error={errors.descriptionService} />

        <Controller
          name="priceService"
          control={control}
          defaultValue={0} // ou undefined
          render={({ field }) => (
            <MoneyInputFallback
              label={"Valor previsto do projeto (R$)"}
              {...field}
              error={errors.priceService}
            />
          )}
        />

        <div>
          <StyledLabel >Escolha o contrato</StyledLabel>
          <StyledSelect id="select" value={selectedOption}
            {...register("selectedOption")}
            onChange={handleChange}>
            <option value="">Selecione um contrato</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </StyledSelect>
        </div>


        <StyledLabel >Cargo</StyledLabel>

        <Controller
          name="selectedOptionService"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <Select
              {...rest}
              isMulti
              onChange={(selected) => {
                console.log("Selecione o cargo:", selected); // 🔍 debug
                onChange(selected);
              }}
              options={occupations.map((srv) => ({ value: srv.id, label: srv.name }))}
              placeholder="Selecione os cargos..."
              // isDisabled={!selectedOptionProject}
              styles={customSelectStyles}
            />
          )}
        />


        <SubmitButton type="submit"> Salvar</SubmitButton>

      </form>
      </InputWraper>
    </FormWrapper>
  )
}
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./Ui/Input";
import { ErrorText, FormTitle, FormWrapper, InputWraper, Select, StyledLabel, SubmitButton, TextArea } from "../layouts/Theme";
import { useState } from "react";
import occupation from "../services/apiOccupation";
import { CreateOccupationSchema } from "../schemas/CreateOccupationSchema";
import Checkbox from "./Ui/Checkbox";
import { MoneyInputFallback } from "./Ui/MoneyInputFallBack";

export default function CreateOccupation() {
  const [selectedOption, setSelectedOption] = useState("")
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateOccupationSchema),
  });

  const onSubmit = async ({ occupationName, descriptionOccupation, selectedOption, priceSalary}) => {
    const dangerousnessBoolean = selectedOption;

    const payload = {

      name: occupationName,
      description_of_occupation: descriptionOccupation,
      dangerousness: dangerousnessBoolean,
      salary:priceSalary
    };

    console.log(payload, "onsumit")

    try {
      await occupation.postOccupation(payload);
      setSelectedOption(""); // <- também limpa o select, se necessário
      reset()         // <- isso limpa os campos do formulário
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar o token.");
    }
  }


  return (
    <FormWrapper>
<FormTitle>Cadastrar Ocupação</FormTitle>
<InputWraper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Ocupação"
          name="occupationName"
          register={register}
          error={errors.occupationName} />

        <TextArea
          rows={3}
          placeholder="Descrição da ocupação"
          {...register("descriptionOccupation")}
          error={errors.descriptionOccupation} />


          <Controller
            name="priceSalary"
            control={control}
            defaultValue={0} // ou undefined
            render={({ field }) => (
              <MoneyInputFallback
                label={"Salário"}
                {...field}
                error={errors.valor}
              />
            )}
          />


        <Checkbox
          label="Possui periculosidade?"
          register={register}
          name="selectedOption"
        />

        {errors.selectedOption && (
          <ErrorText>{errors.selectedOption.message}</ErrorText>
        )}
        <SubmitButton type="submit"> Criar</SubmitButton>

      </form>
      </InputWraper>
    </FormWrapper>
  )
}

// import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorText, FormTitle, FormWrapper, InputWraper, StyledLabel, StyledMaskInput, SubmitButton } from "../layouts/Theme";
import { useForm, Controller } from "react-hook-form";
// import { Input } from "./Ui/Input";
import contract from "../services/apiContract";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./Ui/Input";
// import { Container } from "../layouts/StyledComponents";

export default function RegisterCustomer() {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CustomerSchema),
  });


  const onSubmit = async ({ customerName, customerEmail, customerCNPJ }) => {

    const payload = {

      name: customerName,
      email: customerEmail,
      cnpj: customerCNPJ,
    };

    console.log(payload, "onsumit")

    try {
      await contract.putClient(payload);
      reset()         // <limpa os campos do formulário
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar o token.");
    }
  }



  return (

    // <Container>

      <FormWrapper>
      <FormTitle>Cadastrar cliente</FormTitle>

      <InputWraper>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Input
            type="text"
            label="Nome do cliente"
            name="customerName"
            placeholder="Nome do cliente"
            register={register}
            error={errors.customerName}
          />

          <Input
            type="email"
            label="E-mail de contato"
            name="customerEmail"
            placeholder="exemplo@exemplo.com.br"
            register={register}
            error={errors.customerEmail}
          />


          <StyledLabel>CNPJ</StyledLabel>
          <Controller
            name="customerCNPJ"
            type="number"
            control={control}
            render={({ field }) => (
              <StyledMaskInput
                {...field}
                mask="00.000.000/0000-00"
                definitions={{ "0": /[0-9]/ }}
                onAccept={(value) => field.onChange(value)}
                placeholder="00.000.000/0000-00"
              />
            )}
          />
          {errors.customerCNPJ && <ErrorText>{errors.customerCNPJ.message}</ErrorText>}

          <SubmitButton type="submit">
            Salvar
          </SubmitButton>
        </form>
      </InputWraper>
</FormWrapper>
    // </Container>

  )
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormTitle, FormWrapper, InputWraper, RowInput, StyledLabel, StyledSelect, SubmitButton } from "../layouts/Theme";
import { Input } from "./Ui/Input";
import Checkbox from "./Ui/Checkbox";
import contract from "../services/apiContract";
import { CreateOsSchema } from "../schemas/CreateOsSchema";
import { customSelectStyles } from "../layouts/Theme";
import Select from "react-select";
import serviceOs from "../services/apiOs";

export default function CreateOs() {

  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateOsSchema),
    defaultValues: {
      sameAddress: false,
      selectedOptionService: [],
      selectedOptionProject: ""
    },
  });

  const isSameAddres = watch("sameAddress");
  const selectedOptionProject = watch("selectedOptionProject");

  useEffect(() => {
    // Limpa serviços selecionados ao trocar de projeto
    setValue("selectedOptionService", []);
  }, [selectedOptionProject, setValue]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await contract.getContracts()
        setProjects(response);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedOptionProject) {
      setServices([]);
      setValue("selectedOptionService", []);
      return;
    }
    async function fetchServicos() {
      try {
        const res = await contract.getService(selectedOptionProject)
        setServices(res);
        setValue("selectedOptionService", []);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setServices([]);
      }
    }
    fetchServicos();
  }, [selectedOptionProject, setValue]);

  useEffect(() => {
    if (!isSameAddres) {
      setValue("addressNumberExtension", "")
      setValue("streetExtension", "");
      setValue("neighborhoodExtension", "");
      setValue("cityExtension", "");
      setValue("stateExtension", "");
    }
  }, [isSameAddres, setValue]);

  const onSubmit = async (data) => {
    let extension = {}
    // const cleanCustomerPhone = data.customerPhone.replace(/\D/g, "");
    // const cleanConsultantPhone = data.consultantPhone.replace(/\D/g, "");

    if (data.sameAddress) {
      extension = {
        zipCode: data.zipCodeExtension,
        street: data.streetExtension,
        neighborhood: data.neighborhoodExtension,
        city: data.cityExtension,
        state: data.stateExtension,
        number: data.addressNumberExtension
      };
    } else {
      extension = {
        zipCode: data.zipCode,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        number: data.addressNumber
      }
    }

    const payload = {
      customer: {
        create: {
          name: /*data.customerName*/ "Andreia",
          phone: /*cleanCustomerPhone*/ "11976135505"
        }
      },
      customer_address: {
        create: {
          zip_code: data.zipCode,
          street: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          number: Number(data.addressNumber)
        }
      },
      extension_address: {
        create: {
          zip_code: extension.zipCode,
          street: extension.street,
          neighborhood: extension.neighborhood,
          city: extension.city,
          state: extension.state,
          number: Number(data.addressNumber)
        }
      },
      consultant: {
        create: {
          name: /*data.consultantName*/ "Lorenzo",
          phone: /*cleanConsultantPhone*/"11976135505"
        }
      },
      project_id: Number(selectedOptionProject),
      // service_id:data.selectedOptionService.map(s => s.value)
      service_id: Number(data.selectedOptionService[0]?.value)
    }
    console.log(payload, "onsumit")
    try {
      await serviceOs.postService(payload);
      reset()         // <- isso limpa os campos do formulário
      setProjects([])
      setServices([])
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar o token.");
    }
  }

  async function getZipCodeCustomer(valor) {
    if (valor.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setValue("street", data.logradouro || "");
        setValue("neighborhood", data.bairro || "");
        setValue("city", data.localidade || "");
        setValue("state", data.uf || "");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error.message);
    }
  }

  // Busca CEP para endereço de ramal
  async function getZipCodeExtension(valor) {
    if (valor.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setValue("streetExtension", data.logradouro || "");
        setValue("neighborhoodExtension", data.bairro || "");
        setValue("cityExtension", data.localidade || "");
        setValue("stateExtension", data.uf || "");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP de ramal:", error.message);
    }
  }

  function handleCepChange(e) {
    const valor = e.target.value.replace(/\D/g, "");
    setValue("zipCode", valor);
    if (valor.length === 8) getZipCodeCustomer(valor);
    else {
      setValue("street", ""); setValue("neighborhood", ""); setValue("city", ""); setValue("state", "");
    }
  }

  function handleCepExtensionChange(e) {
    const valor = e.target.value.replace(/\D/g, "");
    setValue("zipCodeExtension", valor);
    if (valor.length === 8) getZipCodeExtension(valor);
    else {
      setValue("streetExtension", ""); setValue("neighborhoodExtension", ""); setValue("cityExtension", ""); setValue("stateExtension", "");
    }
  }

  return (

     <FormWrapper>
    <InputWraper>
      <FormTitle>Emitir nota</FormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>


           <div>
          <StyledLabel >Centro de custo(Projeto)</StyledLabel>

          <StyledSelect
            // id="select" value={selectedOptionProject} 
            {...register("selectedOptionProject")}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione um projeto
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </StyledSelect>
        </div>


        <StyledLabel >Serviço</StyledLabel>

        <Controller
          name="selectedOptionService"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <Select
              {...rest}
              isMulti
              onChange={(selected) => {
                console.log("Serviços selecionados:", selected); // 🔍 debug
                onChange(selected);
              }}
              options={services.map((srv) => ({ value: srv.id, label: srv.name }))}
              placeholder="Selecione os serviços..."
              isDisabled={!selectedOptionProject}
              styles={customSelectStyles}
            />
          )}
        />
       
       {/* <RowInput>
          <Input
            type="text"
            label="Nome do cliente"
            name="customerName"
            register={register}
            error={errors.customerName}
          />

          <Controller
            name="customerPhone"
            control={control}
            render={({ field }) => (

              <Input
                {...field}
                type="phone"
                label="Telefone"
                mask="(00) 0 0000-0000"
                definitions={{ "0": /[0-9]/ }}
                name="customerPhone"
                register={register}
                error={errors.customerPhone}
              />
            )}
          />
        </RowInput> */}


        <RowInput>

          <Input
            label="Cep"
            name="zipCode"
            register={register}
            onChange={handleCepChange}
            maxLength={8} />

        </RowInput>

        <RowInput>
          <Input
            //  value={street} disabled readOnly
            type="text"
            label="Endereço"
            name="street"
            register={register}
            error={errors.street}
          />

          <Input
            type="text"
            label="numero"
            name="addressNumber"
            register={register}
            error={errors.addressNumber}
          />
        </RowInput>

        <RowInput>

          <Input
            // value={neighborhood} disabled readOnly
            type="text"
            label="Bairro"
            name="neighborhood"
            register={register}
            error={errors.neighborhood}
          />

          <Input
            // value={city} disabled readOnly
            type="text"
            label="Cidade"
            name="city"
            register={register}
            error={errors.city}
          />

          <Input
            // value={state} disabled readOnly
            type="text"
            label="estado"
            name="state"
            register={register}
            error={errors.state}
          />
        </RowInput>

        <Checkbox label="Endereço de ramal é diferente?" register={register} name="sameAddress" />

        {isSameAddres && (
          <>
            <RowInput>
              <Input
                // value={zipCodeExtension} 
                type="text"
                label="Cep"
                name="zipCodeExtension"
                register={register}
                onChange={handleCepExtensionChange}
                maxLength={8}
                error={errors.zipCodeExtension}
              />

            </RowInput>

            <RowInput>
              <Input
                //  value={streetExtension} disabled readOnly
                type="text"
                label="Endereço do ramal"
                name="streetExtension"
                register={register}
                error={errors.streetExtension}
              />

              <Input
                type="text"
                label="numero"
                name="addressNumberExtension"
                register={register}
                error={errors.addressNumberExtension}
              />
            </RowInput>

            <RowInput>
              <Input
                // value={neighborhoodExtension} disabled readOnly
                type="text"
                label="Bairro"
                name="neighborhoodExtension"
                register={register}
                error={errors.neighborhoodExtension}
              />

              <Input
                // value={cityExtension} disabled readOnly
                type="text"
                label="Cidade"
                name="cityExtension"
                register={register}
                error={errors.cityExtension}
              />


              <Input
                // value={stateExtension} disabled readOnly
                type="text"
                label="estado"
                name="stateExtension"
                register={register}
                error={errors.stateExtension}
              />
            </RowInput>
          </>
        )}

        {/* <RowInput> */}
          {/* <Input
            type="text"
            label="Nome do consultor"
            name="consultantName"
            register={register}
            error={errors.consultantName}
          />

          <Controller
            name="consultantPhone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="phone"
                label="Telefone"
                mask="(00) 0 0000-0000"
                definitions={{ "0": /[0-9]/ }}
                name="consultantPhone"
                register={register}
                error={errors.consultantPhone}
              />
            )}
          />
        </RowInput> */}


     



        <SubmitButton type="submit">
          Salvar
        </SubmitButton>
      </form>




    </InputWraper>
  </FormWrapper>
  )
}

